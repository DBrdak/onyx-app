using Abstractions.Messaging;
using Identity.Domain;
using Models.Responses;

namespace Identity.Application.User.AddBudgetIdForUser;

internal sealed class AddBudgetIdForUserCommandHandler : ICommandHandler<AddBudgetIdForUserCommand>
{
    private readonly IUserRepository _userRepository;

    public AddBudgetIdForUserCommandHandler(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<Result> Handle(AddBudgetIdForUserCommand request, CancellationToken cancellationToken)
    {
        var userId = new UserId(request.UserId);
        var userGetResult = await _userRepository.GetByIdAsync(userId, cancellationToken);

        if (userGetResult.IsFailure)
        {
            return userGetResult.Error;
        }

        var user = userGetResult.Value;

        user.JoinBudget(Guid.Parse(request.BudgetId));

        return await _userRepository.UpdateAsync(user, cancellationToken);
    }
}
