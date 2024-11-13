using Budget.Application.Contracts.Models;
using Models.Primitives;

namespace Budget.Application.Statistics.Categories;

public sealed record CategoryMonthlyData(MonthModel Month, MoneyModel SpentAmount, MoneyModel AssignedAmount);