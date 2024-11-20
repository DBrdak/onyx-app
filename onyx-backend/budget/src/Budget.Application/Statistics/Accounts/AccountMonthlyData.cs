using Budget.Application.Contracts.Models;

namespace Budget.Application.Statistics.Accounts;

public sealed record AccountMonthlyData(MonthModel Month, MoneyModel SpentAmount, MoneyModel EarnedAmount);