﻿using Identity.Domain;
using Newtonsoft.Json;

namespace Identity.Application.Contracts.Models;

public sealed record UserModel
{
    public Guid Id { get; init; }
    public string Email { get; init; }
    public string Username { get; init; }
    public string Currency { get; init; }
    public bool IsEmailVerified { get; init; }
    public AuthorizationToken? AuthorizationToken { get; init; }

    [JsonConstructor]
    [System.Text.Json.Serialization.JsonConstructor]
    private UserModel(Guid id, string email, string username, string currency, bool isEmailVerified, AuthorizationToken? authorizationToken)
    {
        Id = id;
        Email = email;
        Username = username;
        Currency = currency;
        AuthorizationToken = authorizationToken;
        IsEmailVerified = isEmailVerified;
    }

    public static UserModel FromDomainModel(Domain.User domainModel, AuthorizationToken? authorizationToken = null) =>
        new(
            domainModel.Id.Value,
            domainModel.Email.Value,
            domainModel.Username.Value,
            domainModel.Currency.Code,
            domainModel.IsEmailVerified,
            authorizationToken);

    public static UserModel CreateUnregistered(Email email) =>
            new(Guid.Empty, email.Value, string.Empty, string.Empty, false, null);
}