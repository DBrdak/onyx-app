using Abstractions.Messaging;

namespace Identity.Application.Auth.GoogleLogin;

public sealed record GoogleLoginQuery(string? Origin) : IQuery<string>;
