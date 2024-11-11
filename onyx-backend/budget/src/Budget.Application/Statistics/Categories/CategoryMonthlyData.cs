using Budget.Application.Contracts.Models;

namespace Budget.Application.Statistics.Categories;

public sealed record CategoryMonthlyData(
    string CategoryName,
    MoneyModel SpentAmount,
    MoneyModel AssignedAmount);