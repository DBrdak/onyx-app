using Budget.Application.Contracts.Models;

namespace Budget.Application.Statistics.Categories;

public sealed record SubcategoryMonthlyData(string Name, MoneyModel AssignedAmount, MoneyModel SpentAmount);