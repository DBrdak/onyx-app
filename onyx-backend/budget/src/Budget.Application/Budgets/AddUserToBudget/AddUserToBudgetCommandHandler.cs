using Abstractions.Messaging;
using Budget.Application.Abstractions.Identity;
using Budget.Application.Abstractions.IntegrationEvents;
using Budget.Application.Budgets.Models;
using Budget.Domain.Budgets;
using Models.Responses;

namespace Budget.Application.Budgets.AddUserToBudget;

internal sealed class AddUserToBudgetCommandHandler : ICommandHandler<AddUserToBudgetCommand, BudgetModel>
{
    private readonly IUserContext _userContext;
    private readonly IBudgetRepository _budgetRepository;
    private readonly IQueueMessagePublisher _queueMessagePublisher;

    public AddUserToBudgetCommandHandler(
        IUserContext userContext,
        IBudgetRepository budgetRepository,
        IQueueMessagePublisher queueMessagePublisher)
    {
        _userContext = userContext;
        _budgetRepository = budgetRepository;
        _queueMessagePublisher = queueMessagePublisher;
    }

    public async Task<Result<BudgetModel>> Handle(AddUserToBudgetCommand request, CancellationToken cancellationToken)
    {

        var (userIdGetResult, usernameGetResult, emailGetResult) =
            (_userContext.GetUserId(), _userContext.GetUserUsername(), _userContext.GetUserEmail());

        if (Result.Aggregate([
                userIdGetResult,
                usernameGetResult,
                emailGetResult]) is var result &&
            result.IsFailure)
        {
            return result.Error;
        }

        var userId = userIdGetResult.Value;
        var username = userIdGetResult.Value;
        var userEmail = userIdGetResult.Value;

        var getBudgetResult = await _budgetRepository.GetByIdAsync(new(request.BudgetId), cancellationToken);

        if (getBudgetResult.IsFailure)
        {
            return getBudgetResult.Error;
        }

        var budget = getBudgetResult.Value;

        var addUserResult = budget.AddMember(userId, username, userEmail, request.Token);

        if (addUserResult.IsFailure)
        {
            return addUserResult.Error;
        }

        var updateResult = await _budgetRepository.UpdateAsync(budget, cancellationToken);

        if (updateResult.IsFailure)
        {
            return updateResult.Error;
        }

        budget = updateResult.Value;

        var messagePublishResult = await _queueMessagePublisher.PublishBudgetMemberJoinedAsync(
            userId,
            budget.Id,
            cancellationToken);

        if (messagePublishResult.IsFailure)
        {
            return messagePublishResult.Error;
        }

        return BudgetModel.FromDomainModel(budget);
    }
}