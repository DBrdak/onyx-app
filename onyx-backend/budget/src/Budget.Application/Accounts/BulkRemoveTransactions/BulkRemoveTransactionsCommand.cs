using Abstractions.Messaging;

namespace Budget.Application.Accounts.BulkRemoveTransactions;

public sealed record BulkRemoveTransactionsCommand(string AccountId, string[] TransactionIds) : ICommand;
