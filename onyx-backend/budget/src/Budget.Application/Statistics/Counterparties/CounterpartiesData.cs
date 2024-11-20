using Budget.Application.Contracts.Models;
using Budget.Application.Statistics.Accounts;
using Budget.Application.Statistics.Shared;
using Budget.Domain.Accounts;
using Budget.Domain.Counterparties;
using Budget.Domain.Subcategories;
using Budget.Domain.Transactions;
using Models.Primitives;

namespace Budget.Application.Statistics.Counterparties;

public sealed record CounterpartiesData : IStatisticalData
{
    public IReadOnlyDictionary<string, IEnumerable<CounterpartyMonthlyData>> Data => _data;

    private readonly Dictionary<string, IEnumerable<CounterpartyMonthlyData>> _data = [];
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
        foreach (var counterparty in _counterparties)
        {
            var groupedTransactions = _transactions
                .Where(t => t.CounterpartyId == counterparty.Id)
                .GroupBy(t => MonthDate.FromDateTime(t.TransactedAt).Value)
                .OrderBy(g => g.Key.BegginingOfTheMonthEpoch)
                .ToList();

            if (!groupedTransactions.Any())
            {
                continue;
            }

            var monthlyData = groupedTransactions.Select(
                    group => new CounterpartyMonthlyData(
                        MonthModel.FromDomainModel(group.Key),
                        MoneyModel.FromDomainModel(
                            new Money(
                                group.Where(t => t.BudgetAmount < 0).Sum(t => t.BudgetAmount.Amount),
                                _budget.BaseCurrency)),
                        MoneyModel.FromDomainModel(
                            new Money(
                                group.Where(t => t.BudgetAmount > 0).Sum(t => t.BudgetAmount.Amount),
                                _budget.BaseCurrency))))
                .ToList();

            if (_data.TryAdd(counterparty.Name.Value.ToLower(), monthlyData))
            {
                continue;
            }

            var data = _data[counterparty.Name.Value.ToLower()].ToList();

            foreach (var x in data)
            {
                foreach (var y in monthlyData.Where(y => x.Month == y.Month))
                {
                    x.EarnedAmount.Amount += y.EarnedAmount.Amount;
                    x.SpentAmount.Amount += y.SpentAmount.Amount;
                }
            }

            _data[counterparty.Name.Value.ToLower()] = data;
        }

        var allGroupedTransactions = _transactions
            .Where(t => _counterparties.Any(c => c.Id == t.CounterpartyId))
            .GroupBy(t => MonthDate.FromDateTime(t.TransactedAt).Value)
            .OrderBy(g => g.Key.BegginingOfTheMonthEpoch)
            .ToList();

        if (!allGroupedTransactions.Any())
        {
            return;
        }

        var allMonthlyData = allGroupedTransactions.Select(
                group => new CounterpartyMonthlyData(
                    MonthModel.FromDomainModel(group.Key),
                    MoneyModel.FromDomainModel(
                        new Money(
                            group.Where(t => t.BudgetAmount < 0).Sum(t => t.BudgetAmount.Amount),
                            _budget.BaseCurrency)),
                    MoneyModel.FromDomainModel(
                        new Money(
                            group.Where(t => t.BudgetAmount > 0).Sum(t => t.BudgetAmount.Amount),
                            _budget.BaseCurrency))))
            .ToList();

        if (!_data.TryAdd("all", allMonthlyData))
        {
            _data.Add($"all_{Guid.NewGuid()}", allMonthlyData);
        }
    }
}