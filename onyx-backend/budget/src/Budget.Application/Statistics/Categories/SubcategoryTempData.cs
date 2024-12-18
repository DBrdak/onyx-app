using Budget.Application.Contracts.Models;

namespace Budget.Application.Statistics.Categories;

internal sealed record SubcategoryTempData(string Name, MoneyModel SpentAmount, MoneyModel AssignedAmount);