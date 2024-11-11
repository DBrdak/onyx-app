using Budget.Application.Contracts.Models;
using Budget.Application.Statistics.Shared;
using Budget.Domain.Accounts;
using Budget.Domain.Transactions;
using Models.Primitives;

namespace Budget.Application.Statistics.Accounts;

public sealed record AccountsData : IStatisticalData
{
    public IReadOnlyCollection<AccountsMonthlyData> MonthlyData => _monthlyData;

    private readonly List<AccountsMonthlyData> _monthlyData = new();
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
        if (!_accounts.Any() || !_transactions.Any())
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
            var accountsMonthlyData = (from account in _accounts
                                       let name = account.Name.Value
                                       let transactions = _transactions.Where(
                                           t => t.AccountId == account.Id && t.TransactedAt.Month == month.Month)
                                       let spentAmount = new Money(
                                           transactions.Where(t => t.Amount < 0)
                                               .Sum(t => t.Amount.Amount),
                                           _budget.BaseCurrency)
                                       let earnedAmount = new Money(
                                           transactions.Where(t => t.Amount > 0)
                                               .Sum(t => t.Amount.Amount),
                                           _budget.BaseCurrency)
                                       select new AccountMonthlyData(
                                           name,
                                           MoneyModel.FromDomainModel(spentAmount),
                                           MoneyModel.FromDomainModel(earnedAmount)))
                .ToList();

            _monthlyData.Add(new AccountsMonthlyData(month, accountsMonthlyData));
        }
    }
}