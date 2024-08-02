using Abstractions.Messaging;
using Budget.Application.Accounts.Models;
using Budget.Application.Contracts.Models;
using Budget.Domain.Accounts;
using Budget.Domain.Budgets;
using Budget.Domain.Counterparties;
using Budget.Domain.Subcategories;
using Budget.Domain.Transactions;
using Models.Responses;

namespace Budget.Application.Accounts.BulkAddTransactions;

internal sealed class BulkAddTransactionsCommandHandler : ICommandHandler<BulkAddTransactionsCommand, AccountModel>
{
    private readonly ITransactionRepository _transactionRepository;
    private readonly IAccountRepository _accountRepository;
    private readonly ICounterpartyRepository _counterpartyRepository;
    private readonly ISubcategoryRepository _subcategoryRepository;

    public BulkAddTransactionsCommandHandler(
        ITransactionRepository transactionRepository,
        IAccountRepository accountRepository,
        ICounterpartyRepository counterpartyRepository,
        ISubcategoryRepository subcategoryRepository)
    {
        _transactionRepository = transactionRepository;
        _accountRepository = accountRepository;
        _counterpartyRepository = counterpartyRepository;
        _subcategoryRepository = subcategoryRepository;
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
        var transactions = request.Transactions;

        var factory = new TransactionFactory(account, budgetId);

        var counterpartiesGetTask = transactions.Select(
            t => GetOrCreateCounterpartyAsync(
                t.CounterpartyName,
                t.Amount,
                budgetId,
                cancellationToken));

        var subcategoriesGetTask = transactions.Select(
            t => t.SubcategoryId is not null ? _subcategoryRepository.GetByIdAsync(new (t.SubcategoryId.Value), cancellationToken) : Result.Success())

        factory.CreateTransaction(
            counterparty,
            subcategory,
            transactedAt,
            originalAmount,
            convertedAmount,
            budgetAmount);

        return null;
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
