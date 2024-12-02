using Abstractions.Messaging;
using Microsoft.Extensions.Configuration;
using Models.Responses;
using static System.Formats.Asn1.AsnWriter;

namespace Identity.Application.Auth.GoogleLogin;

internal sealed class GoogleLoginQueryHandler : IQueryHandler<GoogleLoginQuery, string>
{
    private readonly IConfiguration _configuration;
    private const string AuthUrl = "https://accounts.google.com/o/oauth2/v2/auth";
    private const string RedirectUri = "https://13nq38cpog.execute-api.eu-central-1.amazonaws.com/api/v1/auth/google/callback";
    private const string Scope = "https://www.googleapis.com/auth/userinfo.email";
    private string ClientId => _configuration["authentication:google:id"];

    public GoogleLoginQueryHandler(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public async Task<Result<string>> Handle(GoogleLoginQuery request, CancellationToken cancellationToken) =>
        $"{AuthUrl}?client_id={ClientId}&redirect_uri={RedirectUri}&response_type=code&scope={Scope}";
}
