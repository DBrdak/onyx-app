using Budget.Application.Contracts.Models;

namespace Budget.Functions.Functions.Accounts.Requests;

#pragma warning disable CS1591
public sealed record AccountBulkAddTransactionsRequest(BulkdAddTransactionRequest[] Transactions);
public sealed record BulkdAddTransactionRequest(
    MoneyModel Amount,
    DateTime TransactedAt,
    string CounterpartyName,
    Guid? SubcategoryId);