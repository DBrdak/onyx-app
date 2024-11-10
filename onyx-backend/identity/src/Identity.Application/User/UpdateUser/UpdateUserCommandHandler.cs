using Abstractions.Messaging;
using Identity.Application.Abstractions.Authentication;
using Identity.Application.Contracts.Models;
using Identity.Domain;
using Models.Responses;

namespace Identity.Application.User.UpdateUser;

internal sealed class UpdateUserCommandHandler : ICommandHandler<UpdateUserCommand, UserModel>
{
    private readonly IUserRepository _userRepository;
    private readonly IJwtService _jwtService;
    private readonly IUserContext _userContext;

    public UpdateUserCommandHandler(IUserRepository userRepository, IJwtService jwtService, IUserContext userContext)
    {
        _userRepository = userRepository;
        _jwtService = jwtService;
        _userContext = userContext;
    }

    public async Task<Result<UserModel>> Handle(UpdateUserCommand request, CancellationToken cancellationToken)
    {
        var userIdGetResult = _userContext.GetUserId();

        if (userIdGetResult.IsFailure)
        {
            return userIdGetResult.Error;
        }

        var userId = new UserId(userIdGetResult.Value);

        var userGetResult = await _userRepository.GetByIdAsync(userId, cancellationToken);

        if (userGetResult.IsFailure)
        {
            return userGetResult.Error;
        }

        var user = userGetResult.Value;

        var updateResult = request switch
        {
            _ when !string.IsNullOrWhiteSpace(request.NewCurrency) =>
                user.ChangeCurrency(request.NewCurrency),
            _ when !string.IsNullOrWhiteSpace(request.NewUsername) =>
                user.ChangeUsername(request.NewUsername),
            _ when !string.IsNullOrWhiteSpace(request.NewEmail) &&
                   !string.IsNullOrWhiteSpace(request.VerificationCode) =>
                user.ChangeEmail(request.NewEmail, request.VerificationCode),
            _ => new Error("UpdateUserCommand.InvalidInput", "Invalid input for user update")
        };

        if (updateResult.IsFailure)
        {
            return updateResult.Error;
        }

        if (string.IsNullOrWhiteSpace(request.VerificationCode))
        {
            return await _userRepository.UpdateAsync(user, cancellationToken) is var result && result.IsFailure ?
                result.Error :
                UserModel.FromDomainModel(result.Value);
        }

        var tokenGenerateResult = _jwtService.GenerateJwt(user);

        if (tokenGenerateResult.IsFailure)
        {
            return tokenGenerateResult.Error;
        }

        var token = tokenGenerateResult.Value;

        var longLivedTokenGenerateResult = _jwtService.GenerateLongLivedToken(user.Id);

        if (longLivedTokenGenerateResult.IsFailure)
        {
            return longLivedTokenGenerateResult.Error;
        }

        var longLivedToken = longLivedTokenGenerateResult.Value;

        user.SetLongLivedToken(longLivedToken);

        var userUpdateResult = await _userRepository.UpdateAsync(user, cancellationToken);

        if (userUpdateResult.IsFailure)
        {
            return userUpdateResult.Error;
        }

        user = userUpdateResult.Value;

        return UserModel.FromDomainModel(userUpdateResult.Value, new(token, longLivedToken));
    }

    private async Task<Result> UpdateEmail(string email, string verificationCode, Domain.User user)
    {
        var emailCreateResult = Email.Create(email);

        if (emailCreateResult.IsFailure)
        {
            return emailCreateResult.Error;
        }

        var emailValue = emailCreateResult.Value;

        var userGetResult = await _userRepository.GetByEmailAsync(emailValue, CancellationToken.None);
        var isEmailUnique = userGetResult.IsFailure || user.Id == userGetResult.Value.Id;

        return isEmailUnique ? 
            user.ChangeEmail(email, verificationCode) :
            new Error("UpdateUserCommand.EmailNotUnique", "User with this email address already exitst");
    }
}