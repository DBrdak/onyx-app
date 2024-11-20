using Abstractions.Messaging;
using Identity.Application.Abstractions.Authentication;
using Identity.Application.Contracts.Models;
using Identity.Domain;
using Microsoft.Extensions.Configuration;
using Models.Responses;
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
        var tokenResult = _jwtService.GenerateJwt(user);

        return tokenResult.IsSuccess ?
            UserModel.FromDomainModel(user, new AuthorizationToken(tokenResult.Value)) :
            tokenResult.Error;
    }

    private async Task<string?> GetGoogleToken(string code)
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
            ["redirect_uri"] = "https://identity.onyxapp.tech/api/v1/auth/google/callback",
            ["grant_type"] = "authorization_code"
        }));

        var content = await response.Content.ReadAsStringAsync();
        var tokenData = JObject.Parse(content);

        return tokenData["id_token"]?.ToString();
    }
}
