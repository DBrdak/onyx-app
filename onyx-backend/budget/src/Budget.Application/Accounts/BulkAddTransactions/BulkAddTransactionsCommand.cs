using Abstractions.Messaging;
using Budget.Application.Accounts.Models;
using Budget.Application.Contracts.Models;

namespace Budget.Application.Accounts.BulkAddTransactions;

public sealed record BulkAddTransactionsCommand(
    IEnumerable<TransactionAddModel> Transactions,
    Guid AccountId,
    Guid BudgetId) : ICommand<AccountModel>;

public sealed record TransactionAddModel(
    MoneyModel Amount,
    DateTime TransactedAt,
    string CounterpartyName,
    Guid? SubcategoryId);