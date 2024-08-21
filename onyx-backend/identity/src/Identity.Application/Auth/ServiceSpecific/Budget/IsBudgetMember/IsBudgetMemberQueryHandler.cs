using Abstractions.Messaging;
using Identity.Application.Abstractions.Authentication;
using Identity.Domain;
using Models.Responses;

namespace Identity.Application.Auth.ServiceSpecific.Budget.IsBudgetMember;

internal sealed class IsBudgetMemberQueryHandler : IQueryHandler<IsBudgetMemberQuery, bool>
{
    private readonly IUserRepository _userRepository;
    private readonly IJwtService _jwtService;

    public IsBudgetMemberQueryHandler(IUserRepository userRepository, IJwtService jwtService)
    {
        _userRepository = userRepository;
        _jwtService = jwtService;
    }

    public async Task<Result<bool>> Handle(IsBudgetMemberQuery request, CancellationToken cancellationToken)
    {
        var getUserBudgetIdsResult = _jwtService.GetBudgetsIdsFromToken(request.Token);

        if (getUserBudgetIdsResult.IsFailure)
        {
            return getUserBudgetIdsResult.IsFailure;
        }

        var userBudgetIds = getUserBudgetIdsResult.Value;

        var isUserAMemberOfBudget = userBudgetIds.Any(id => id.ToString() == request.BudgetId);

        if (isUserAMemberOfBudget)
        {
            return true;
        }

        var userIdGetResult = _jwtService.GetUserIdFromToken(request.Token);

        if (userIdGetResult.IsFailure)
        {
            return userIdGetResult.Error;
        }

        var userId = userIdGetResult.Value;

        var userGetResult = await _userRepository.GetByIdAsync(new UserId(userId), cancellationToken);

        if (userGetResult.IsFailure)
        {
            return userGetResult.Error;
        }

        var user = userGetResult.Value;

        return user.BudgetsIds.Any(budgetId => budgetId.ToString() == request.BudgetId);
    }
}
