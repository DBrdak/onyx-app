using Abstractions.Messaging;

namespace Identity.Application.User.RemoveBudgetIdForUser;

public sealed record RemoveBudgetIdForUserCommand(string UserId, string BudgetId) : ICommand;
