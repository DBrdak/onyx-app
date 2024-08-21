using Abstractions.Messaging;
using Budget.Application.Abstractions.IntegrationEvents;
using Budget.Domain.Accounts;
using Budget.Domain.Budgets;
using Budget.Domain.Categories;
using Budget.Domain.Counterparties;
using Budget.Domain.Subcategories;
using Budget.Domain.Transactions;
using Models.Responses;

namespace Budget.Application.Budgets.RemoveBudget;

internal sealed class RemoveBudgetCommandHandler : ICommandHandler<RemoveBudgetCommand>
{
    private readonly IBudgetRepository _budgetRepository;
    private readonly IQueueMessagePublisher _queueMessagePublisher;
    private readonly IAccountRepository _accountRepository;
    private readonly ICounterpartyRepository _counterpartyRepository;
    private readonly ICategoryRepository _categoryRepository;
    private readonly ISubcategoryRepository _subcategoryRepository;
    private readonly ITransactionRepository _transactionRepository;

    public RemoveBudgetCommandHandler(
        IBudgetRepository budgetRepository,
        IQueueMessagePublisher queueMessagePublisher,
        IAccountRepository accountRepository,
        ICounterpartyRepository counterpartyRepository,
        ICategoryRepository categoryRepository,
        ISubcategoryRepository subcategoryRepository,
        ITransactionRepository transactionRepository)
    {
        _budgetRepository = budgetRepository;
        _queueMessagePublisher = queueMessagePublisher;
        _accountRepository = accountRepository;
        _counterpartyRepository = counterpartyRepository;
        _categoryRepository = categoryRepository;
        _subcategoryRepository = subcategoryRepository;
        _transactionRepository = transactionRepository;
    }

    public async Task<Result> Handle(RemoveBudgetCommand request, CancellationToken cancellationToken)
    {
        var budgetId = new BudgetId(request.BudgetId);  
        var budgetGetResult = await _budgetRepository.GetByIdAsync(budgetId, cancellationToken);

        if (budgetGetResult.IsFailure)
        {
            return budgetGetResult.Error;
        }
        
        var budget = budgetGetResult.Value;

        var removeAllRelativesTask = RemoveAllRelativesAsync(budgetId, cancellationToken);

        var messagePublishTasks = budget.BudgetMembers
            .ToList()
            .Select(member => _queueMessagePublisher.PublishBudgetMemberJoinedAsync(
                member.Id,
                budget.Id,
                cancellationToken));

        var results = await Task.WhenAll([removeAllRelativesTask, .. messagePublishTasks]);

        if (results.FirstOrDefault(result => result.IsFailure) is var removeResult && removeResult.IsFailure)
        {
            return removeResult.Error;
        }

        return await _budgetRepository.RemoveAsync(budget.Id, cancellationToken);
    }

    private async Task<Result> RemoveAllRelativesAsync(BudgetId budgetId, CancellationToken cancellationToken)
    {
        var (accountsGetResult, categoriesGetResult, counterpartiesGetResult, subcategoriesGetResult, transactionsGetResult) = (
            await _accountRepository.GetAllAsync(cancellationToken),
            await _categoryRepository.GetAllAsync(cancellationToken),
            await _counterpartyRepository.GetAllAsync(cancellationToken),
            await _subcategoryRepository.GetAllAsync(cancellationToken),
            await _transactionRepository.GetAllAsync(cancellationToken));

        if (Result.Aggregate(
                accountsGetResult,
                categoriesGetResult,
                counterpartiesGetResult,
                subcategoriesGetResult,
                transactionsGetResult) is var result &&
            result.IsFailure)
        {
            return result.Error;
        }

        var (accounts, categories, counterparties, subcategories, transactions) = (
            accountsGetResult.Value, categoriesGetResult.Value, counterpartiesGetResult.Value,
            subcategoriesGetResult.Value, transactionsGetResult.Value);

        var removeResults = await Task.WhenAll(
        [
            _accountRepository.RemoveRangeAsync(accounts.Select(a => a.Id), cancellationToken),
            _categoryRepository.RemoveRangeAsync(categories.Select(c => c.Id), cancellationToken),
            _counterpartyRepository.RemoveRangeAsync(counterparties.Select(c => c.Id), cancellationToken),
            _subcategoryRepository.RemoveRangeAsync(subcategories.Select(s => s.Id), cancellationToken),
            _transactionRepository.RemoveRangeAsync(transactions.Select(t => t.Id), cancellationToken)
        ]);

        if (Result.Aggregate(removeResults) is var removeResult &&
            removeResult.IsFailure)
        {
            return removeResult.Error;
        }

        return Result.Success();
    }
}