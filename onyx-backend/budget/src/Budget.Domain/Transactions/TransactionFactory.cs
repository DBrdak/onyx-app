using Budget.Domain.Accounts;
using Budget.Domain.Budgets;
using Budget.Domain.Counterparties;
using Budget.Domain.Subcategories;
using Models.DataTypes;
using Models.Responses;

namespace Budget.Domain.Transactions;

public sealed class TransactionFactory
{
    private static Account account;
    private static BudgetId budgetId;
    private Counterparty _counterparty;
    private Subcategory? _subcategory;
    private DateTime _transactedAt;
    private Money _originalAmount;
    private Money? _convertedAmount;
    private Money? _budgetAmount;
    private bool IsForeignTransaction => _convertedAmount is not null;
    private bool IsOutflow => _originalAmount < 0;

    public TransactionFactory(Account account, BudgetId budgetId)
    {
        TransactionFactory.account = account;
        TransactionFactory.budgetId = budgetId;
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

    private Result<Transaction>
        SwitchTransactionCreate(bool isForeignTransaction, bool isOutflow) =>
        (isForeignTransaction, isOutflow, _subcategory, _convertedAmount) switch
        {
            (true, true, not null, not null) => Transaction.CreateForeignOutflow(
                account,
                _subcategory,
                _convertedAmount,
                _originalAmount,
                _transactedAt,
                _counterparty,
                _budgetAmount,
                budgetId),
            (true, false, _, not null) => Transaction.CreateForeignInflow(
                account,
                _convertedAmount,
                _originalAmount,
                _transactedAt,
                _counterparty,
                _budgetAmount,
                budgetId),
            (false, true, not null, _) => Transaction.CreatePrincipalOutflow(
                account,
                _subcategory,
                _originalAmount,
                _transactedAt,
                _counterparty,
                _budgetAmount,
                budgetId),
            (false, false, _, _) => Transaction.CreatePrincipalInflow(
                account,
                _originalAmount,
                _transactedAt,
                _counterparty,
                _budgetAmount,
                budgetId),
            _ => TransactionErrors.InvalidCreateParameters
        };
}