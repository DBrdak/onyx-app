using Abstractions.Messaging;
using Budget.Application.Abstractions.Identity;
using Budget.Domain.Budgets;
using Models.Responses;

namespace Budget.Application.Budgets.IsBudgetMember;

internal sealed class IsBudgetMemberQueryHandler : IQueryHandler<IsBudgetMemberQuery, bool>
{
    private readonly IUserContext _userContext;
    private readonly IBudgetContext _budgetContext;
    private readonly IBudgetRepository _budgetRepository;

    public IsBudgetMemberQueryHandler(
        IUserContext userContext,
        IBudgetContext budgetContext,
        IBudgetRepository budgetRepository)
    {
        _userContext = userContext;
        _budgetContext = budgetContext;
        _budgetRepository = budgetRepository;
    }

    public async Task<Result<bool>> Handle(IsBudgetMemberQuery request, CancellationToken cancellationToken)
    {
        var budgetIdGetResult = _budgetContext.GetBudgetId();

        if (budgetIdGetResult.IsFailure)
        {
            return true;
        }

        var budgetId = budgetIdGetResult.Value;

        var getUserBudgetIdsResult = _userContext.GetBudgetsIds();

        if (getUserBudgetIdsResult.IsFailure)
        {
            return getUserBudgetIdsResult.Error;
        }

        var isUserAMemberOfBudget = getUserBudgetIdsResult.Value.Any(id => id == budgetId);

        if (isUserAMemberOfBudget)
        {
            return true;
        }

        var userIdGetResult = _userContext.GetUserId();

        if (userIdGetResult.IsFailure)
        {
            return userIdGetResult.Error;
        }

        var userId = userIdGetResult.Value;

        var userBudgetsGetResult = await _budgetRepository.GetBudgetsForMemberAsync(userId, cancellationToken);

        if (userBudgetsGetResult.IsFailure)
        {
            return userBudgetsGetResult.Error;
        }

        var userBudgets = userBudgetsGetResult.Value;

        return userBudgets.Any(budget => budget.Id.Value == budgetId);
    }
}
