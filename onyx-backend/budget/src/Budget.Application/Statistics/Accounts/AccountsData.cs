using Budget.Application.Contracts.Models;
using Budget.Application.Statistics.Categories;
using Budget.Application.Statistics.Shared;
using Budget.Domain.Accounts;
using Budget.Domain.Transactions;
using Models.Primitives;
using System.Security.Principal;

namespace Budget.Application.Statistics.Accounts;

public sealed record AccountsData : IStatisticalData
{
    public IReadOnlyDictionary<string, IEnumerable<AccountMonthlyData>> Data => _data;

    private readonly Dictionary<string, IEnumerable<AccountMonthlyData>> _data = [];
    private readonly IEnumerable<Account> _accounts;
    private readonly IEnumerable<Transaction> _transactions;
    private readonly Domain.Budgets.Budget _budget;

    public AccountsData(IEnumerable<Account> accounts, IEnumerable<Transaction> transactions, Domain.Budgets.Budget budget)
    {
        _accounts = accounts;
        _transactions = transactions;
        _budget = budget;
    }

    public void Calculate()
    {
        foreach (var account in _accounts)
        {
            var groupedTransactions = _transactions
                .Where(t => t.AccountId == account.Id)
                .GroupBy(t => MonthDate.FromDateTime(t.TransactedAt).Value)
                .OrderBy(g => g.Key.BegginingOfTheMonthEpoch)
                .ToList();

            if (!groupedTransactions.Any())
            {
                continue;
            }

            var monthlyData = groupedTransactions.Select(
                    group => new AccountMonthlyData(
                        MonthModel.FromDomainModel(group.Key),
                        MoneyModel.FromDomainModel(
                            new Money(group.Where(t => t.BudgetAmount < 0).Sum(t => t.BudgetAmount.Amount), _budget.BaseCurrency)),
                        MoneyModel.FromDomainModel(
                            new Money(group.Where(t => t.BudgetAmount > 0).Sum(t => t.BudgetAmount.Amount), _budget.BaseCurrency))))
                .ToList();

            _data.TryAdd(account.Name.Value, monthlyData);
        }

        var allGroupedTransactions = _transactions
            .Where(t => _accounts.Any(a => a.Id == t.AccountId))
            .GroupBy(t => MonthDate.FromDateTime(t.TransactedAt).Value)
            .OrderBy(g => g.Key.BegginingOfTheMonthEpoch)
            .ToList();

        if (!allGroupedTransactions.Any())
        {
            return;
        }

        var allMonthlyData = allGroupedTransactions.Select(
            group => new AccountMonthlyData(
                MonthModel.FromDomainModel(group.Key),
                MoneyModel.FromDomainModel(
                    new Money(group.Where(t => t.BudgetAmount < 0).Sum(t => t.BudgetAmount.Amount), _budget.BaseCurrency)),
                MoneyModel.FromDomainModel(
                    new Money(group.Where(t => t.BudgetAmount > 0).Sum(t => t.BudgetAmount.Amount), _budget.BaseCurrency))))
            .ToList();

        if (!_data.TryAdd("all", allMonthlyData))
        {
            _data.Add($"all_{Guid.NewGuid()}", allMonthlyData);
        }
    }
}