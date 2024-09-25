using Abstractions.Messaging;
using Identity.Application.Abstractions.Authentication;
using Identity.Domain;
using Models.Responses;

namespace Identity.Application.User.IsBudgetMember;

internal sealed class IsBudgetMemberQueryHandler : IQueryHandler<IsBudgetMemberQuery, bool>
{
    private readonly IUserContext _userContext;
    private readonly IUserRepository _userRepository;
    private readonly RequestAccessor _requestAccessor;

    public IsBudgetMemberQueryHandler(
        IUserContext userContext,
        IUserRepository userRepository,
        RequestAccessor requestAccessor)
    {
        _userContext = userContext;
        _userRepository = userRepository;
        _requestAccessor = requestAccessor;
    }

    public async Task<Result<bool>> Handle(IsBudgetMemberQuery request, CancellationToken cancellationToken)
    {
        _requestAccessor.PathParams.TryGetValue("budgetId", out var budgetId);

        if (string.IsNullOrWhiteSpace(budgetId))
        {
            return true;
        }

        var budgetsIdsGetResult = _userContext.GetBudgetsIds();

        if (budgetsIdsGetResult.IsSuccess)
        {
            var budgetIds = budgetsIdsGetResult.Value;

            if (budgetIds.Any(id => id == budgetId))
            {
                return true;
            }
        }

        var userIdGetResult = _userContext.GetUserId();

        if (userIdGetResult.IsFailure)
        {
            return userIdGetResult.IsFailure;
        }

        var getUserResult = await _userRepository.GetByIdAsync(new (userIdGetResult.Value), cancellationToken);

        if (getUserResult.IsFailure)
        {
            return getUserResult.Error;
        }

        var user = getUserResult.Value;

        return user.BudgetsIds.Any(id => id.ToString() == budgetId);
    }
}
