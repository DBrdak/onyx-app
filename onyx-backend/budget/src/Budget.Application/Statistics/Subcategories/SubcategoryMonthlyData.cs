using Budget.Application.Contracts.Models;

namespace Budget.Application.Statistics.Subcategories;

public sealed record SubcategoryMonthlyData(MonthModel Month, MoneyModel SpentAmount, MoneyModel AssignedAmount);