using Budget.Application.Contracts.Models;

namespace Budget.Application.Statistics.Subcategories;

public sealed record SubcategoryMonthlyData(string Name, MoneyModel AssignedAmount, MoneyModel SpentAmount);