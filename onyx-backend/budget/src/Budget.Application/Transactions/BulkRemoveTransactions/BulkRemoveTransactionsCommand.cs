using Abstractions.Messaging;

namespace Budget.Application.Transactions.BulkRemoveTransactions;

public sealed record BulkRemoveTransactionsCommand(Guid[] TransactionIds) : ICommand;
