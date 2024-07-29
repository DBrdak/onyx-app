﻿using Abstractions.Messaging;
using Budget.Application.Abstractions.Identity;
using Microsoft.AspNetCore.Http;
using Models.Responses;

namespace Budget.Infrastructure.Contexts;

internal sealed class UserContext : IUserContext
{
    private readonly RequestAccessor _requestAccessor;
    private const string userIdClaimName = "Id";
    private const string userCurrencyClaimName = "Currency";
    private readonly Error _userIdClaimNotFound = new(
        "UserContext.UserIdNotFound",
        "Cannot retrieve user ID");
    private readonly Error _usercurrencyClaimNotFound = new(
        "UserContext.CurrencyNotFound",
        "Cannot retrieve base currency for user");

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

    public Result<string> GetUserCurrency() =>
        _requestAccessor
            .Claims
            .FirstOrDefault(claim => claim.Type == userCurrencyClaimName)?
            .Value is var currency && !string.IsNullOrEmpty(currency) ?
            currency :
            _usercurrencyClaimNotFound;
}