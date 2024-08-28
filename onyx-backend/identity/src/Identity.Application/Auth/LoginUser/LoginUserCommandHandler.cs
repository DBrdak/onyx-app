using Abstractions.Messaging;
using Identity.Application.Abstractions.Authentication;
using Identity.Application.Contracts.Models;
using Identity.Domain;
using Models.Responses;

namespace Identity.Application.Auth.LoginUser;

internal sealed class LoginUserCommandHandler : ICommandHandler<LoginUserCommand, AuthorizationToken>
{
    private readonly IJwtService _jwtService;
    private readonly IUserRepository _userRepository;

    public LoginUserCommandHandler(IJwtService jwtService, IUserRepository userRepository)
    {
        _jwtService = jwtService;
        _userRepository = userRepository;
    }

    public async Task<Result<AuthorizationToken>> Handle(LoginUserCommand request, CancellationToken cancellationToken)
    {
        var emailCreateResult = Email.Create(request.Email);

        if (emailCreateResult.IsFailure)
        {
            return emailCreateResult.Error;
        }

        var email = emailCreateResult.Value;

        var userGetResult = await _userRepository.GetByEmailAsync(email, cancellationToken);

        if (userGetResult.IsFailure)
        {
            return Result.Failure<AuthorizationToken>(userGetResult.Error);
        }

        var user = userGetResult.Value;

        var longLivedTokenCreateResult = _jwtService.GenerateLongLivedToken(user.Id);

        if (longLivedTokenCreateResult.IsFailure)
        {
            return longLivedTokenCreateResult.Error;
        }

        var loginResult = user.LogIn(request.Password, longLivedTokenCreateResult.Value);

        if (loginResult.IsFailure)
        {
            return Result.Failure<AuthorizationToken>(loginResult.Error);
        }

        var jwtGenerateResult = _jwtService.GenerateJwt(user);

        if (jwtGenerateResult.IsFailure)
        {
            return Result.Failure<AuthorizationToken>(jwtGenerateResult.Error);
        }

        var jwt = jwtGenerateResult.Value;

        var updateResult = await _userRepository.UpdateAsync(user, cancellationToken);

        if (updateResult.IsFailure)
        {
            return updateResult.Error;
        }

        return new AuthorizationToken(jwt, user.LongLivedToken);
    }
}