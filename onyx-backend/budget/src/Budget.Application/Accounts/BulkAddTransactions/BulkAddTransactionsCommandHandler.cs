using Abstractions.Messaging;
using Amazon.Lambda.Core;
using Budget.Application.Abstractions.Currency;
using Budget.Application.Accounts.Models;
using Budget.Application.Contracts.Models;
using Budget.Domain.Accounts;
using Budget.Domain.Budgets;
using Budget.Domain.Counterparties;
using Budget.Domain.Subcategories;
using Budget.Domain.Transactions;
using Models.Primitives;
using Models.Responses;
using Newtonsoft.Json;

namespace Budget.Application.Accounts.BulkAddTransactions;

internal sealed class BulkAddTransactionsCommandHandler : ICommandHandler<BulkAddTransactionsCommand, AccountModel>
{
    private readonly ITransactionRepository _transactionRepository;
    private readonly IBudgetRepository _budgetRepository;
    private readonly IAccountRepository _accountRepository;
    private readonly ICounterpartyRepository _counterpartyRepository;
    private readonly ISubcategoryRepository _subcategoryRepository;
    private readonly ICurrencyConverter _currencyConverter;

    public BulkAddTransactionsCommandHandler(
        ITransactionRepository transactionRepository,
        IAccountRepository accountRepository,
        ICounterpartyRepository counterpartyRepository,
        ISubcategoryRepository subcategoryRepository,
        IBudgetRepository budgetRepository,
        ICurrencyConverter currencyConverter)
    {
        _transactionRepository = transactionRepository;
        _accountRepository = accountRepository;
        _counterpartyRepository = counterpartyRepository;
        _subcategoryRepository = subcategoryRepository;
        _budgetRepository = budgetRepository;
        _currencyConverter = currencyConverter;
    }

    public async Task<Result<AccountModel>> Handle(BulkAddTransactionsCommand request, CancellationToken cancellationToken)
    {
        var accountId = new AccountId(request.AccountId);
        var budgetId = new BudgetId(request.BudgetId);

        var accountGetResult = await _accountRepository.GetByIdAsync(accountId, cancellationToken);

        if (accountGetResult.IsFailure)
        {
            return accountGetResult.Error;
        }

        var account = accountGetResult.Value;

        var budgetGetResult = await _budgetRepository.GetCurrentBudgetAsync(cancellationToken);

        if (budgetGetResult.IsFailure)
        {
            return budgetGetResult.Error;
        }

        var budget = budgetGetResult.Value;


        var transactions = request.Transactions.ToList();

        var factory = new TransactionFactory(account, budgetId);

        var counterpartiesGetTasks = transactions.Select(
            t => GetOrCreateCounterpartyAsync(
                t.CounterpartyName,
                t.Amount,
                budgetId,
                cancellationToken)).ToList();

        var subcategoriesGetTasks = transactions.Select(
                t => GetSubcategoriesAsync(
                    t.SubcategoryId,
                    t.Amount,
                    cancellationToken,
                    budget))
            .ToList();

        var accountCurrency = account.Balance.Currency;
        var budgetCurrency = budget.BaseCurrency;

        var convertToAccountCurrencyTasks = transactions.Select(
            t => ConvertCurrencyAsync(t.Amount, accountCurrency, cancellationToken));
        var convertToBudgetCurrencyTasks = transactions.Select(
            t => ConvertCurrencyAsync(t.Amount, budgetCurrency, cancellationToken));

        var counterpartiesGetResults = await Task.WhenAll(counterpartiesGetTasks);
        var subcategoriesGetResults = await Task.WhenAll(subcategoriesGetTasks);
        var convertToAccountCurrencyResults = await Task.WhenAll(convertToAccountCurrencyTasks);
        var convertToBudgetCurrencyResults = await Task.WhenAll(convertToBudgetCurrencyTasks);
        var getOriginalCurrencyResults = transactions.Select(t => t.Amount.ToDomainModel()).ToList();

        if (Result.Aggregate(
            [
                .. counterpartiesGetResults,
                .. subcategoriesGetResults,
                .. convertToAccountCurrencyResults,
                .. convertToBudgetCurrencyResults,
                .. getOriginalCurrencyResults,
            ]) is var result && result.IsFailure)
        {
            return result.Error;
        }

        var counterparties = counterpartiesGetResults.Select(c => c.Value).ToList();
        var subcategories = subcategoriesGetResults.Select(s => s.Value).ToList();
        var accountAmounts = convertToAccountCurrencyResults.Select(aa => aa.Value).ToList();
        var budgetAmounts = convertToBudgetCurrencyResults.Select(ba => ba.Value).ToList();
        var transactedAts = transactions.Select(t => t.TransactedAt).ToList();
        var originalAmounts = getOriginalCurrencyResults.Select(oa => oa.Value).ToList();

        var createModelsCreateResult = TransactionCreateModel.CreateManyFromArray(
            counterparties,
            subcategories,
            transactedAts,
            originalAmounts,
            accountAmounts!,
            budgetAmounts!);

        if (createModelsCreateResult.IsFailure)
        {
            return createModelsCreateResult.Error;
        }

        var createModels = createModelsCreateResult.Value;

        var transactionsCreateResults = createModels.Select(
            model => factory.CreateTransaction(
                model.Counterparty,
                model.Subcategory,
                model.TransactedAt,
                model.OriginalAmount,
                model.ConvertedAmount,
                model.BudgetAmount)).ToList();

        if (Result.Aggregate(transactionsCreateResults) is var transactionsCreateResult && transactionsCreateResult.IsFailure)
        {
            return transactionsCreateResult.Error;
        }

        var createdTransactions = transactionsCreateResults.Select(t => t.Value).ToList();

        //TODO Debug
        LambdaLogger.Log("transactions: " + JsonConvert.SerializeObject(createdTransactions));
        LambdaLogger.Log("transactions: " + JsonConvert.SerializeObject(subcategories));
        LambdaLogger.Log("transactions: " + JsonConvert.SerializeObject(account));

        var transactionsAddTask = _transactionRepository.AddRangeAsync(createdTransactions, cancellationToken);
        var subcategoriesUpdateTask = _subcategoryRepository.UpdateRangeAsync(subcategories.Where(s => s != null)!, cancellationToken);

        _ = await Task.WhenAll(transactionsAddTask, subcategoriesUpdateTask);
        var accountUpdateResult = await _accountRepository.UpdateAsync(account, cancellationToken);

        if (accountUpdateResult.IsFailure)
        {
            return accountUpdateResult.Error;
        }

        account = accountUpdateResult.Value;

        return AccountModel.FromDomainModel(account);
    }

    private Task<Result<Subcategory?>> GetSubcategoriesAsync(Guid? subcategoryId, MoneyModel amount, CancellationToken cancellationToken, Domain.Budgets.Budget budget)
    {
        if (subcategoryId is null && budget.UnknownSubcategoryId is not null)
        {
            return _subcategoryRepository.GetByIdAsync(budget.UnknownSubcategoryId, cancellationToken)!;
        }

        if (subcategoryId is not null)
        {
            return _subcategoryRepository.GetByIdAsync(new(subcategoryId.Value), cancellationToken)!;
        }

        if (amount.Amount > 0)
        {
            return Task.FromResult(Result.CreateNullable<Subcategory>(null));
        }

        throw new ArgumentNullException(
            nameof(budget.UnknownSubcategoryId),
            "Budget is not set up");
    }

    private Task<Result<Money>> ConvertCurrencyAsync(
        MoneyModel money,
        Currency destinationCurrency,
        CancellationToken cancellationToken)
    {
        var currencyCreateResult = Currency.FromCode(money.Currency);

        if (currencyCreateResult.IsFailure)
        {
            return Task.FromResult(Result.Failure<Money>(currencyCreateResult.Error));
        }

        var currency = currencyCreateResult.Value;

        if (currency == destinationCurrency)
        {
            return Task.FromResult(money.ToDomainModel());
        }

        var amountCreateResult = money.ToDomainModel();

        if (amountCreateResult.IsFailure)
        {
            return Task.FromResult(Result.Failure<Money>(amountCreateResult.Error));
        }

        return _currencyConverter.ConvertMoney(
            amountCreateResult.Value,
            destinationCurrency,
            cancellationToken);
    }

    private Task<Result<Counterparty>> GetOrCreateCounterpartyAsync(
        string counterpartyName,
        MoneyModel amount,
        BudgetId budgetId,
        CancellationToken cancellationToken)
    {
        var nameCreateResult = CounterpartyName.Create(counterpartyName);

        if (nameCreateResult.IsFailure)
        {
            return Task.FromResult(Result.Failure<Counterparty>(nameCreateResult.Error));
        }

        var name = nameCreateResult.Value;

        return _counterpartyRepository.GetByNameAndTypeOrAddAsync(
            name,
            amount.Amount < 0 ?
                CounterpartyType.Payee :
                CounterpartyType.Payer,
            budgetId,
            cancellationToken);
    }
}
