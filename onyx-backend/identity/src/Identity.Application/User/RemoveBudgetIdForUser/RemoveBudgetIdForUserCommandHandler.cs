using Abstractions.Messaging;
using Identity.Domain;
using Models.Responses;

namespace Identity.Application.User.RemoveBudgetIdForUser;

internal sealed class RemoveBudgetIdForUserCommandHandler : ICommandHandler<RemoveBudgetIdForUserCommand>
{
    private readonly IUserRepository _userRepository;

    public RemoveBudgetIdForUserCommandHandler(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<Result> Handle(RemoveBudgetIdForUserCommand request, CancellationToken cancellationToken)
    {
        var userId = new UserId(request.UserId);
        var userGetResult = await _userRepository.GetByIdAsync(userId, cancellationToken);

        if (userGetResult.IsFailure)
        {
            return userGetResult.Error;
        }

        var user = userGetResult.Value;

        user.LeaveBudget(Guid.Parse(request.BudgetId));

        return await _userRepository.UpdateAsync(user, cancellationToken);
    }
}
