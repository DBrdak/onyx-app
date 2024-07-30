﻿using System.Security.Claims;

namespace Abstractions.Messaging;

public sealed class RequestAccessor
{
    public string? AuthorizationToken { get; private set; }
    public IEnumerable<Claim> Claims { get; private set; }
    public string Path { get; private set; }
    public string Method { get; private set; }

    public RequestAccessor()
    { }

    public void SetUp(string? authorizationToken, IEnumerable<Claim> claims, string path, string method)
    {
        AuthorizationToken = authorizationToken;
        Claims = claims;
        Path = path;
        Method = method;
    }
}