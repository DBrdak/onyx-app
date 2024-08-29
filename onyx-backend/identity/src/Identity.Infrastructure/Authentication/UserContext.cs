using Abstractions.Messaging;
using Identity.Application.Abstractions.Authentication;
using Identity.Infrastructure.Authentication.Models;
using Models.Responses;

namespace Identity.Infrastructure.Authentication;

internal sealed class UserContext : IUserContext
{
    private readonly RequestAccessor _requestAccessor;
    private readonly Error _userIdClaimNotFound = new(
        "UserContext.UserIdNotFound",
        "Cannot retrieve user ID");
    private readonly Error _userBudgetsIdsClaimNotFound = new(
        "UserContext.BudgetsIdsNotFound",
        "Cannot retrieve budgets IDs for user");

    public UserContext(RequestAccessor requestAccessor)
    {
        _requestAccessor = requestAccessor;
    }

    public Result<string> GetUserId() =>
        _requestAccessor
            .Claims
            .FirstOrDefault(claim => claim.Type == UserRepresentationModel.IdClaimName)?
            .Value is var id && !string.IsNullOrEmpty(id) ?
            id :
            _userIdClaimNotFound;

    public Result<IEnumerable<string>> GetBudgetsIds() =>
        _requestAccessor
            .Claims
            .FirstOrDefault(claim => claim.Type == UserRepresentationModel.BudgetIdsClaimName)?
            .Value is var ids && !string.IsNullOrWhiteSpace(ids) ?
            ids.Split(',') :
            _userBudgetsIdsClaimNotFound;
}