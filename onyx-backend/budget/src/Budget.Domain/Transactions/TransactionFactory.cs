using Budget.Domain.Accounts;
using Budget.Domain.Budgets;
using Budget.Domain.Counterparties;
using Budget.Domain.Subcategories;
using Models.Primitives;
using Models.Responses;

namespace Budget.Domain.Transactions;

public sealed class TransactionFactory
{
    private static Account _account;
    private static BudgetId _budgetId;
    private Counterparty _counterparty;
    private Subcategory? _subcategory;
    private DateTime _transactedAt;
    private Money _originalAmount;
    private Money? _convertedAmount;
    private Money? _budgetAmount;
    private bool IsForeignTransaction =>
        _convertedAmount is not null && _convertedAmount.Currency != _originalAmount.Currency;
    private bool IsOutflow => _originalAmount < 0;

    public TransactionFactory(Account account, BudgetId budgetId)
    {
        _account = account;
        _budgetId = budgetId;
    }

    public Result<Transaction> CreateTransaction(
        Counterparty counterparty,
        Subcategory? subcategory,
        DateTime transactedAt,
        Money originalAmount,
        Money? convertedAmount,
        Money? budgetAmount)
    {
        _counterparty = counterparty;
        _subcategory = subcategory;
        _transactedAt = transactedAt;
        _originalAmount = originalAmount;
        _convertedAmount = convertedAmount;
        _budgetAmount = budgetAmount;

        return SwitchTransactionCreate(IsForeignTransaction, IsOutflow);
    }

    private Result<Transaction> SwitchTransactionCreate(bool isForeignTransaction, bool isOutflow) =>
        (isForeignTransaction, isOutflow, _subcategory, _convertedAmount) switch
        {
            (true, true, not null, not null) => Transaction.CreateForeignOutflow(
                _account,
                _subcategory,
                _convertedAmount,
                _originalAmount,
                _transactedAt,
                _counterparty,
                _budgetAmount,
                _budgetId),
            (true, false, _, not null) => Transaction.CreateForeignInflow(
                _account,
                _convertedAmount,
                _originalAmount,
                _transactedAt,
                _counterparty,
                _budgetAmount,
                _budgetId),
            (false, true, not null, _) => Transaction.CreatePrincipalOutflow(
                _account,
                _subcategory,
                _originalAmount,
                _transactedAt,
                _counterparty,
                _budgetAmount,
                _budgetId),
            (false, false, _, _) => Transaction.CreatePrincipalInflow(
                _account,
                _originalAmount,
                _transactedAt,
                _counterparty,
                _budgetAmount,
                _budgetId),
            _ => TransactionErrors.InvalidCreateParameters
        };
}