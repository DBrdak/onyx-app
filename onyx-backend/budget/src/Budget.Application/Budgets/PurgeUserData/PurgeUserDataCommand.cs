using Abstractions.Messaging;

namespace Budget.Application.Budgets.PurgeUserData;

public sealed record PurgeUserDataCommand(string UserId) : ICommand;
