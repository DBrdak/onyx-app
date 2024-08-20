using Abstractions.Messaging;
using Budget.Application.Abstractions.IntegrationEvents;
using Budget.Application.Budgets.Models;
using Budget.Domain.Budgets;
using Models.Responses;

namespace Budget.Application.Budgets.RemoveUserFromBudgetBudget;

internal sealed class RemoveUserFromBudgetCommandHandler : ICommandHandler<RemoveUserFromBudgetCommand, BudgetModel>
{
    private readonly IBudgetRepository _repository;
    private readonly IQueueMessagePublisher _queueMessagePublisher;

    public RemoveUserFromBudgetCommandHandler(
        IBudgetRepository repository,
        IQueueMessagePublisher queueMessagePublisher)
    {
        _repository = repository;
        _queueMessagePublisher = queueMessagePublisher;
    }

    public async Task<Result<BudgetModel>> Handle(RemoveUserFromBudgetCommand request, CancellationToken cancellationToken)
    {
        var budgetId = new BudgetId(request.BudgetId);
        var getBudgetResult = await _repository.GetByIdAsync(budgetId, cancellationToken);

        if (getBudgetResult.IsFailure)
        {
            return getBudgetResult.Error;
        }

        var budget = getBudgetResult.Value;

        var updateBudgetResult = budget.ExcludeUser(request.UserIdToRemove);

        if (updateBudgetResult.IsFailure)
        {
            return updateBudgetResult.Error;
        }

        var updateResult = await _repository.UpdateAsync(budget, cancellationToken);

        if (updateResult.IsFailure)
        {
            return updateResult.Error;
        }
        budget = updateResult.Value;

        var messagePublishResult = await _queueMessagePublisher.PublishBudgetMemberJoinedAsync(
            request.UserIdToRemove,
            budget.Id,
            cancellationToken);

        if (messagePublishResult.IsFailure)
        {
            return messagePublishResult.Error;
        }

        return BudgetModel.FromDomainModel(budget);
    }
}