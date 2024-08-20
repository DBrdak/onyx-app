using Abstractions.Messaging;
using Budget.Application.Abstractions.IntegrationEvents;
using Budget.Domain.Budgets;
using Models.Responses;

namespace Budget.Application.Budgets.RemoveBudget;

internal sealed class RemoveBudgetCommandHandler : ICommandHandler<RemoveBudgetCommand>
{
    private readonly IBudgetRepository _budgetRepository;
    private readonly IQueueMessagePublisher _queueMessagePublisher;

    public RemoveBudgetCommandHandler(
        IBudgetRepository budgetRepository,
        IQueueMessagePublisher queueMessagePublisher)
    {
        _budgetRepository = budgetRepository;
        _queueMessagePublisher = queueMessagePublisher;
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

        foreach (var member in budget.BudgetMembers)
        {
            var messagePublishResult = await _queueMessagePublisher.PublishBudgetMemberJoinedAsync(
                member.Id,
                budget.Id,
                cancellationToken);

            if (messagePublishResult.IsFailure)
            {
                return messagePublishResult.Error;
            }
        }

        return await _budgetRepository.RemoveAsync(budget.Id, cancellationToken);
    }
}