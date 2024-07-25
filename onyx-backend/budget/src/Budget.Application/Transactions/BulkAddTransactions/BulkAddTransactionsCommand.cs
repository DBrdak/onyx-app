using Abstractions.Messaging;
using Budget.Application.Shared.Models;
using Budget.Application.Transactions.Models;

namespace Budget.Application.Transactions.BulkAddTransactions;

public sealed record BulkAddTransactionsCommand(
    Guid AccountId,
    MoneyModel Amount,
    DateTime TransactedAt,
    string CounterpartyName,
    Guid? SubcategoryId,
    Guid BudgetId) : ICommand<IEnumerable<TransactionModel>>;