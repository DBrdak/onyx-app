using Abstractions.Messaging;
using Budget.Application.Statistics.Shared;
using Budget.Domain.Accounts;
using Budget.Domain.Budgets;
using Budget.Domain.Categories;
using Budget.Domain.Counterparties;
using Budget.Domain.Subcategories;
using Budget.Domain.Transactions;
using Models.Responses;

namespace Budget.Application.Statistics;

internal sealed class GetStatisticalDataQueryHandler : IQueryHandler<GetStatisticalDataQuery, StatisticalData>
{
    private readonly IAccountRepository _accountsRepository;
    private readonly ICategoryRepository _categoryRepository;
    private readonly ICounterpartyRepository _counterpartyRepository;
    private readonly IBudgetRepository _budgetRepository;
    private readonly ISubcategoryRepository _subcategoryRepository;
    private readonly ITransactionRepository _transactionRepository;

    public GetStatisticalDataQueryHandler(
        IAccountRepository accountsRepository,
        ICategoryRepository categoryRepository,
        ICounterpartyRepository counterpartyRepository,
        IBudgetRepository budgetRepository,
        ISubcategoryRepository subcategoryRepository,
        ITransactionRepository transactionRepository)
    {
        _accountsRepository = accountsRepository;
        _categoryRepository = categoryRepository;
        _counterpartyRepository = counterpartyRepository;
        _budgetRepository = budgetRepository;
        _subcategoryRepository = subcategoryRepository;
        _transactionRepository = transactionRepository;
    }

    public async Task<Result<StatisticalData>> Handle(GetStatisticalDataQuery request, CancellationToken cancellationToken)
    {
        var accountsGetTask = _accountsRepository.GetAllAsync(cancellationToken);
        var categoriesGetTask = _categoryRepository.GetAllAsync(cancellationToken);
        var counterpartiesGetTask = _counterpartyRepository.GetAllAsync(cancellationToken);
        var budgetGetTask = _budgetRepository.GetCurrentBudgetAsync(cancellationToken);
        var subcategoriesGetTask = _subcategoryRepository.GetAllAsync(cancellationToken);
        var transactionsGetTask = _transactionRepository.GetAllAsync(cancellationToken);

        await Task.WhenAll(
            accountsGetTask,
            categoriesGetTask,
            counterpartiesGetTask,
            budgetGetTask,
            subcategoriesGetTask,
            transactionsGetTask);

        var accountsGetResult = await accountsGetTask;
        var categoriesGetResult = await categoriesGetTask;
        var counterpartiesGetResult = await counterpartiesGetTask;
        var budgetGetResult = await budgetGetTask;
        var subcategoriesGetResult = await subcategoriesGetTask;
        var transactionsGetResult = await transactionsGetTask;

        if (Result.Aggregate(
            [
                accountsGetResult,
                categoriesGetResult,
                counterpartiesGetResult,
                budgetGetResult,
                subcategoriesGetResult,
                transactionsGetResult
            ]) is var result &&
            result.IsFailure)
        {
            return result.Error;
        }

        var accounts = accountsGetResult.Value;
        var categories = categoriesGetResult.Value;
        var counterparties = counterpartiesGetResult.Value;
        var budget = budgetGetResult.Value;
        var subcategories = subcategoriesGetResult.Value;
        var transactions = transactionsGetResult.Value;

        var statisticalData = new StatisticalData(
            accounts.ToList(),
            categories.ToList(),
            counterparties.ToList(),
            budget,
            subcategories.ToList(),
            transactions.ToList());

        statisticalData.Calculate();

        return statisticalData;
    }
}