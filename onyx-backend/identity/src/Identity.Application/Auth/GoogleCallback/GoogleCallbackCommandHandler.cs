using Abstractions.Messaging;
using Amazon.Lambda.Core;
using Identity.Application.Abstractions.Authentication;
using Identity.Application.Contracts.Models;
using Identity.Domain;
using Microsoft.Extensions.Configuration;
using Models.Responses;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

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
        var googleToken = await GetGoogleToken(request.Code);

        if (googleToken is null)
        {
            return new Error("Google.InvalidCode", "Invalid Google code has been provided");
        }

        var email = _jwtService.GetEmailFromGoogleToken(googleToken);
        var userEmailCreateResult = Email.Create(email);

        if (userEmailCreateResult.IsFailure)
        {
            return userEmailCreateResult.Error;
        }

        var userEmail = userEmailCreateResult.Value;
        var userGetResult = await _userRepository.GetByEmailAsync(userEmail, cancellationToken);

        if (userGetResult.IsFailure)
        {
            return UserModel.CreateUnregistered(userEmail);
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

    private async Task<string?> GetGoogleToken(string? code)
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
            ["redirect_uri"] = "https://13nq38cpog.execute-api.eu-central-1.amazonaws.com/api/v1/auth/google/callback",
            ["grant_type"] = "authorization_code"
        }));

        var content = await response.Content.ReadAsStringAsync();
        var tokenData = JObject.Parse(content);

        LambdaLogger.Log($"code: {code}");
        LambdaLogger.Log($"response content: {content}");
        LambdaLogger.Log($"token: {JsonConvert.SerializeObject(tokenData)}");
        LambdaLogger.Log($"retireved token_id: {JsonConvert.SerializeObject(tokenData["id_token"])}");

        return tokenData["id_token"]?.ToString();
    }
}
