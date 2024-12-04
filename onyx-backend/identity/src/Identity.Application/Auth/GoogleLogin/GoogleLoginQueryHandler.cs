using Abstractions.Messaging;
using Extensions;
using Microsoft.Extensions.Configuration;
using Models.Responses;
using static System.Formats.Asn1.AsnWriter;

namespace Identity.Application.Auth.GoogleLogin;

internal sealed class GoogleLoginQueryHandler : IQueryHandler<GoogleLoginQuery, string>
{
    private readonly IConfiguration _configuration;
    private const string AuthUrl = "https://accounts.google.com/o/oauth2/v2/auth";
    private const string Scope = "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile";
    private string ClientId => _configuration["authentication:google:id"];

    public GoogleLoginQueryHandler(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public async Task<Result<string>> Handle(GoogleLoginQuery request, CancellationToken cancellationToken)
    {
        var origin = request.Origin;

        if (string.IsNullOrWhiteSpace(origin) || !origin.IsUrl())
        {
            return GoogleLoginErrors.InvalidHost;
        }

        return await Task.FromResult(
            new Uri($"{AuthUrl}?client_id={ClientId}&redirect_uri={origin}/login/google&response_type=code&scope={Scope}").AbsolutePath);
    }
}