using Abstractions.Messaging;
using Budget.Application.Accounts.Models;

namespace Budget.Application.Accounts.BulkRemoveTransactions;

public sealed record BulkRemoveTransactionsCommand(string AccountId, string[] TransactionIds) : ICommand<AccountModel>;
