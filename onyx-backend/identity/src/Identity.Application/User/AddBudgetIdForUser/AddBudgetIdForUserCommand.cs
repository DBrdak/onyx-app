using Abstractions.Messaging;

namespace Identity.Application.User.AddBudgetIdForUser;

public sealed record AddBudgetIdForUserCommand(string UserId, string BudgetId) : ICommand;
