using Budget.Application.Contracts.Models;
using Models.Primitives;

namespace Budget.Application.Statistics.Budget;

public sealed record BudgetMonthlyData(MonthModel Month, MoneyModel SpentAmount, MoneyModel EarnedAmount);