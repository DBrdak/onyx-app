using Budget.Application.Contracts.Models;

namespace Budget.Application.Statistics.Accounts;

public sealed record AccountMonthlyData(string AccountName, MoneyModel SpentAmount, MoneyModel EarnedAmount);