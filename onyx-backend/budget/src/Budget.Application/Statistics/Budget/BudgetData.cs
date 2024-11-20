using Budget.Application.Contracts.Models;
using Budget.Application.Statistics.Shared;
using Models.Primitives;
using Transaction = Budget.Domain.Transactions.Transaction;

namespace Budget.Application.Statistics.Budget;

public sealed record BudgetData : IStatisticalData
{
    public IReadOnlyList<BudgetMonthlyData> MonthlyData => _monthlyData;

    private readonly List<BudgetMonthlyData> _monthlyData = [];
    private readonly IEnumerable<Transaction> _transactions;
    private readonly Domain.Budgets.Budget _budget;

    public BudgetData(IEnumerable<Transaction> transactions, Domain.Budgets.Budget budget)
    {
        _transactions = transactions;
        _budget = budget;
    }

    public void Calculate()
    {
        if (!_transactions.Any())
        {
            return;
        }

        var chronologigalDates = _transactions
            .Select(t => t.TransactedAt)
            .OrderBy(date => date)
            .ToList();

        var periodCreateResult = MonthPeriod.Create(chronologigalDates.First(), chronologigalDates.Last());

        if (periodCreateResult.IsFailure)
        {
            return;
        }

        var period = periodCreateResult.Value;

        foreach (var month in period.ToMonthsArray())
        {
            var earnedAmount = new Money(
                _transactions.Where(t => t.BudgetAmount > 0)
                    .Sum(t => t.BudgetAmount.Amount),
                _budget.BaseCurrency);
            var spentAmount = new Money(
                _transactions.Where(t => t.BudgetAmount < 0)
                    .Sum(t => t.BudgetAmount.Amount),
                _budget.BaseCurrency);

            _monthlyData.Add(
                new BudgetMonthlyData(
                    MonthModel.FromDomainModel(month), 
                    MoneyModel.FromDomainModel(spentAmount),
                    MoneyModel.FromDomainModel(earnedAmount)));
        }
    }
}