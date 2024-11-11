using Budget.Application.Contracts.Models;
using Budget.Application.Statistics.Shared;
using Budget.Domain.Counterparties;
using Budget.Domain.Transactions;
using Models.Primitives;

namespace Budget.Application.Statistics.Counterparties;

public sealed record CounterpartiesData : IStatisticalData
{
    public IReadOnlyCollection<CounterpartiesMonthlyData> MonthlyData => _monthlyData;

    private readonly List<CounterpartiesMonthlyData> _monthlyData = new();
    private readonly IEnumerable<Counterparty> _counterparties;
    private readonly IEnumerable<Transaction> _transactions;
    private readonly Domain.Budgets.Budget _budget;

    internal CounterpartiesData(
        IEnumerable<Counterparty> counterparties,
        IEnumerable<Transaction> transactions,
        Domain.Budgets.Budget budget)
    {
        _counterparties = counterparties;
        _transactions = transactions;
        _budget = budget;
    }

    public void Calculate()
    {
        if (!_counterparties.Any() || !_transactions.Any())
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
            var counterpartiesMonthlyData = (from counterparty in _counterparties
                                             let name = counterparty.Name.Value
                                             let transactions = _transactions.Where(
                                                 t => t.CounterpartyId == counterparty.Id && t.TransactedAt.Month == month.Month)
                                             let spentAmount = new Money(
                                                 transactions.Where(t => t.Amount < 0)
                                                     .Sum(t => t.Amount.Amount),
                                                 _budget.BaseCurrency)
                                             let earnedAmount = new Money(
                                                 transactions.Where(t => t.Amount > 0)
                                                     .Sum(t => t.Amount.Amount),
                                                 _budget.BaseCurrency)
                                             select new CounterpartyMonthlyData(
                                                 name,
                                                 MoneyModel.FromDomainModel(spentAmount),
                                                 MoneyModel.FromDomainModel(earnedAmount)))
                .ToList();

            _monthlyData.Add(new CounterpartiesMonthlyData(month, counterpartiesMonthlyData));
        }
    }
}