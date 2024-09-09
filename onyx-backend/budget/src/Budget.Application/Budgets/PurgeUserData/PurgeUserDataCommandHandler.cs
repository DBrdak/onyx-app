using Abstractions.Messaging;
using Budget.Application.Abstractions.Identity;
using Budget.Application.Abstractions.IntegrationEvents;
using Budget.Domain.Accounts;
using Budget.Domain.Budgets;
using Budget.Domain.Categories;
using Budget.Domain.Counterparties;
using Budget.Domain.Subcategories;
using Budget.Domain.Transactions;
using Models.Responses;

namespace Budget.Application.Budgets.PurgeUserData;

internal sealed class PurgeUserDataCommandHandler : ICommandHandler<PurgeUserDataCommand>
{
    private readonly IBudgetRepository _budgetRepository;
    private readonly IQueueMessagePublisher _queueMessagePublisher;

    public PurgeUserDataCommandHandler(IBudgetRepository budgetRepository, IQueueMessagePublisher queueMessagePublisher)
    {
        _budgetRepository = budgetRepository;
        _queueMessagePublisher = queueMessagePublisher;
    }

    public async Task<Result> Handle(PurgeUserDataCommand request, CancellationToken cancellationToken)
    {
        var budgetsGetResult =
            await _budgetRepository.GetBudgetsForMemberAsync(request.UserId, cancellationToken);

        if (budgetsGetResult.IsFailure)
        {
            return budgetsGetResult.Error;
        }

        var budgets = budgetsGetResult.Value.ToList();

        var budgetsToRemove = budgets.Where(b => b.BudgetMembers.Count == 1);
        var budgetsToAmend = budgets.Where(b => b.BudgetMembers.Count != 1);

        var result = await RemoveUserFromBudgetsAsync(budgetsToRemove, request.UserId, cancellationToken);
        //await RemoveAllRelativesAsync(budgetsToAmend, request.UserId, cancellationToken);

        return result;
    }

    private async Task<Result> RemoveUserFromBudgetsAsync(
        IEnumerable<Domain.Budgets.Budget> budgets,
        string userId,
        CancellationToken cancellationToken)
    {
        var messagePublishTasks = budgets.Select(
            budget => _queueMessagePublisher.PublishBudgetMemberRemoveAsync(
                userId,
                budget.Id,
                cancellationToken));

        var results = await Task.WhenAll(messagePublishTasks);

        return Result.Aggregate(results);
    }


    //private async Task<Result> RemoveAllRelativesAsync(CancellationToken cancellationToken)
    //{
    //    var (accountsGetResult, categoriesGetResult, counterpartiesGetResult, subcategoriesGetResult, transactionsGetResult) = (
    //        await _accountRepository.GetAllAsync(cancellationToken),
    //        await _categoryRepository.GetAllAsync(cancellationToken),
    //        await _counterpartyRepository.GetAllAsync(cancellationToken),
    //        await _subcategoryRepository.GetAllAsync(cancellationToken),
    //        await _transactionRepository.GetAllAsync(cancellationToken));

    //    if (Result.Aggregate([
    //            accountsGetResult,
    //            categoriesGetResult,
    //            counterpartiesGetResult,
    //            subcategoriesGetResult,
    //            transactionsGetResult]) is var result &&
    //        result.IsFailure)
    //    {
    //        return result.Error;
    //    }

    //    var (accounts, categories, counterparties, subcategories, transactions) = (
    //        accountsGetResult.Value, categoriesGetResult.Value, counterpartiesGetResult.Value,
    //        subcategoriesGetResult.Value, transactionsGetResult.Value);

    //    var removeResults = await Task.WhenAll(
    //    [
    //        _accountRepository.RemoveRangeAsync(accounts.Select(a => a.Id), cancellationToken),
    //        _categoryRepository.RemoveRangeAsync(categories.Select(c => c.Id), cancellationToken),
    //        _counterpartyRepository.RemoveRangeAsync(counterparties.Select(c => c.Id), cancellationToken),
    //        _subcategoryRepository.RemoveRangeAsync(subcategories.Select(s => s.Id), cancellationToken),
    //        _transactionRepository.RemoveRangeAsync(transactions.Select(t => t.Id), cancellationToken)
    //    ]);

    //    return Result.Aggregate(removeResults);
    //}
}
