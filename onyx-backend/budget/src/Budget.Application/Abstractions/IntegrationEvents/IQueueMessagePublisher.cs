using Budget.Domain.Budgets;
using Models.Responses;

namespace Budget.Application.Abstractions.IntegrationEvents;

public interface IQueueMessagePublisher
{
    Task<Result> PublishBudgetMemberRemoveAsync(
        string budgetMemberId,
        BudgetId budgetId,
        CancellationToken cancellationToken);
    Task<Result> PublishBudgetMemberJoinedAsync(
        string newBudgetMemberId,
        BudgetId budgetId,
        CancellationToken cancellationToken);
}