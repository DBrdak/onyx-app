using Abstractions.Messaging;
using Identity.Application.Contracts.Models;

namespace Identity.Application.Auth.RefreshAccessToken;

public sealed record RefreshAccessTokenCommand(string LongLivedToken)
    : IQuery<AuthorizationToken>;