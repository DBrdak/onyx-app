using Budget.Application.Contracts.Models;
using Budget.Application.Statistics.Shared;
using Budget.Domain.Accounts;
using Budget.Domain.Categories;
using Budget.Domain.Subcategories;
using Models.Primitives;

namespace Budget.Application.Statistics.Categories;

public sealed record CategoriesData : IStatisticalData
{
    public IReadOnlyDictionary<string, IEnumerable<CategoryMonthlyData>> Data => _data;

    private readonly Dictionary<string, IEnumerable<CategoryMonthlyData>> _data = [];
    private readonly IEnumerable<Category> _categories;
    private readonly IEnumerable<Subcategory> _subcategories;
    private readonly Domain.Budgets.Budget _budget;

    internal CategoriesData(
        IEnumerable<Category> categories,
        IEnumerable<Subcategory> subcategories,
        Domain.Budgets.Budget budget)
    {
        _categories = categories;
        _subcategories = subcategories;
        _budget = budget;
    }

    public void Calculate()
    {
        foreach (var category in _categories)
        {
            var groupedAssignments = _subcategories
                .Where(s => category.SubcategoriesId.Contains(s.Id))
                .SelectMany(s => s.Assignments)
                .GroupBy(a => a.Month)
                .OrderBy(g => g.Key.BegginingOfTheMonthEpoch)
                .ToList();

            if (!groupedAssignments.Any())
            {
                continue;
            }

            var monthlyData = groupedAssignments.Select(
                group => new CategoryMonthlyData(
                    MonthModel.FromDomainModel(group.Key),
                    MoneyModel.FromDomainModel(
                        new Money(group.Sum(a => a.ActualAmount.Amount), _budget.BaseCurrency)),
                    MoneyModel.FromDomainModel(
                        new Money(group.Sum(a => a.AssignedAmount.Amount), _budget.BaseCurrency))))
            .ToList();

            _data.TryAdd(category.Name.Value, monthlyData);
        }

        var allGroupedAssignments = _subcategories
            .Where(s => _categories.Select(c => c.SubcategoriesId.Contains(s.Id)).Any())
            .SelectMany(s => s.Assignments)
            .GroupBy(a => a.Month)
            .OrderBy(g => g.Key.BegginingOfTheMonthEpoch)
            .ToList();

        if (!allGroupedAssignments.Any())
        {
            return;
        }

        var allMonthlyData = allGroupedAssignments.Select(
            group => new CategoryMonthlyData(
                MonthModel.FromDomainModel(group.Key),
                MoneyModel.FromDomainModel(
                    new Money(group.Sum(a => a.ActualAmount.Amount), _budget.BaseCurrency)),
                MoneyModel.FromDomainModel(
                    new Money(group.Sum(a => a.AssignedAmount.Amount), _budget.BaseCurrency))))
            .ToList();

        if (!_data.TryAdd("all", allMonthlyData))
        {
            _data.Add($"all_{Guid.NewGuid()}", allMonthlyData);
        }
    }
}