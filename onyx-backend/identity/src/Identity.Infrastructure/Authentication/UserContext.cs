using Abstractions.Messaging;
using Identity.Application.Abstractions.Authentication;
using Microsoft.AspNetCore.Http;
using Models.Responses;

namespace Identity.Infrastructure.Authentication;

internal sealed class UserContext : IUserContext
{
    private readonly RequestAccessor _requestAccessor;
    private const string userIdClaimName = "Id";
    private readonly Error _userIdClaimNotFound = new(
        "UserContext.UserIdNotFound",
        "Cannot retrieve user ID");

    public UserContext(RequestAccessor requestAccessor)
    {
        _requestAccessor = requestAccessor;
    }

    public Result<string> GetUserId() =>
        _requestAccessor
            .Claims
            .FirstOrDefault(claim => claim.Type == userIdClaimName)?
            .Value is var id && !string.IsNullOrEmpty(id) ?
            id :
            _userIdClaimNotFound;
}