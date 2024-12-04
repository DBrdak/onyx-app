using Abstractions.Messaging;
using Amazon.Lambda.Core;
using Extensions;
using Identity.Application.Abstractions.Authentication;
using Identity.Application.Auth.GoogleLogin;
using Identity.Application.Contracts.Models;
using Identity.Domain;
using Microsoft.Extensions.Configuration;
using Models.Primitives;
using Models.Responses;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Xml.Linq;

namespace Identity.Application.Auth.GoogleCallback;

internal sealed class GoogleCallbackCommandHandler : ICommandHandler<GoogleCallbackCommand, UserModel>
{
    private readonly IConfiguration _configuration;
    private readonly IJwtService _jwtService;
    private readonly IUserRepository _userRepository;
    private string Secret => _configuration["authentication:google:secret"];
    private string ClientId => _configuration["authentication:google:id"];
    private const string TokenUrl = "https://oauth2.googleapis.com/token";

    public GoogleCallbackCommandHandler(IConfiguration configuration, IJwtService jwtService, IUserRepository userRepository)
    {
        _configuration = configuration;
        _jwtService = jwtService;
        _userRepository = userRepository;
    }

    public async Task<Result<UserModel>> Handle(GoogleCallbackCommand request, CancellationToken cancellationToken)
    {
        var origin = request.Origin;

        if (string.IsNullOrWhiteSpace(origin) || !origin.IsUrl())
        {
            return GoogleLoginErrors.InvalidHost;
        }

        var googleToken = await GetGoogleToken(request.Code, origin);

        if (googleToken is null)
        {
            return new Error("Google.InvalidCode", "Invalid Google code has been provided");
        }

        var email = _jwtService.GetFieldFromGoogleToken("email", googleToken);
        var userEmailCreateResult = Email.Create(email ?? "");

        if (userEmailCreateResult.IsFailure)
        {
            return userEmailCreateResult.Error;
        }

        var userEmail = userEmailCreateResult.Value;
        var userGetResult = await _userRepository.GetByEmailAsync(userEmail, cancellationToken);

        userGetResult = userGetResult.IsFailure ?
            Domain.User.RegisterOAuth(
                email ?? string.Empty,
                _jwtService.GetFieldFromGoogleToken(
                    "given_name",
                    googleToken) ??
                string.Empty) :
            userGetResult;

        if (userGetResult.IsFailure)
        {
            return userGetResult.Error;
        }

        var user = userGetResult.Value;

        var longLivedTokenCreateResult = _jwtService.GenerateLongLivedToken(user.Id);

        if (longLivedTokenCreateResult.IsFailure)
        {
            return longLivedTokenCreateResult.Error;
        }

        var longLivedToken = longLivedTokenCreateResult.Value;

        user.SetLongLivedToken(longLivedToken);

        var jwtGenerateResult = _jwtService.GenerateJwt(user);

        if (jwtGenerateResult.IsFailure)
        {
            return jwtGenerateResult.Error;
        }

        var jwt = jwtGenerateResult.Value;

        var updateResult = await _userRepository.UpdateAsync(user, cancellationToken);

        if (updateResult.IsFailure)
        {
            return updateResult.Error;
        }

        return UserModel.FromDomainModel(user, new AuthorizationToken(jwt, longLivedToken));
    }

    private async Task<string?> GetGoogleToken(string? code, string origin)
    {
        if(string.IsNullOrWhiteSpace(code))
        {
            return null;
        }

        var httpClient = new HttpClient();
        var response = await httpClient.PostAsync(TokenUrl, new FormUrlEncodedContent(new Dictionary<string, string>
        {
            ["code"] = code,
            ["client_id"] = ClientId,
            ["client_secret"] = Secret,
            ["redirect_uri"] = $"{origin}/google/login",
            ["grant_type"] = "authorization_code"
        }));

        var content = await response.Content.ReadAsStringAsync();
        var tokenData = JObject.Parse(content);

        return tokenData["id_token"]?.ToString();
    }
}
