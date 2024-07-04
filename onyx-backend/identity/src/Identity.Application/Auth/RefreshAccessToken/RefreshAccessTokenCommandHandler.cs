using Abstractions.Messaging;
using Identity.Application.Abstractions.Authentication;
using Identity.Application.Contracts.Models;
using Identity.Domain;
using Models.Responses;

namespace Identity.Application.Auth.RefreshAccessToken;

internal sealed class RefreshAccessTokenCommandHandler : IQueryHandler<RefreshAccessTokenCommand, AuthorizationToken>
{
    private readonly IUserRepository _userRepository;
    private readonly IJwtService _jwtService;

    public RefreshAccessTokenCommandHandler(IUserRepository userRepository, IJwtService jwtService)
    {
        _userRepository = userRepository;
        _jwtService = jwtService;
    }

    public async Task<Result<AuthorizationToken>> Handle(RefreshAccessTokenCommand request, CancellationToken cancellationToken)
    {
        var userId = new UserId(request.UserId);

        var userGetResult = await _userRepository.GetByIdAsync(userId, cancellationToken);

        if (userGetResult.IsFailure)
        {
            return userGetResult.Error;
        }

        var user = userGetResult.Value;

        var accessTokenGenerateResult = _jwtService.GenerateJwt(user);

        if (accessTokenGenerateResult.IsFailure)
        {
            return accessTokenGenerateResult.Error;
        }

        var accessToken = accessTokenGenerateResult.Value;

        var refreshTokenGenerateResult = _jwtService.GenerateLongLivedToken();

        if (refreshTokenGenerateResult.IsFailure)
        {
            return refreshTokenGenerateResult.Error;
        }

        var longLivedToken = refreshTokenGenerateResult.Value;

        user.SetLongLivedToken(longLivedToken);

        await _userRepository.UpdateAsync(user, cancellationToken);

        return new AuthorizationToken(accessToken, longLivedToken);
    }
}