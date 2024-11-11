using Budget.Application.Contracts.Models;
using Budget.Application.Statistics.Shared;
using Budget.Application.Subcategories.Models;
using Budget.Domain.Categories;
using Budget.Domain.Subcategories;
using Budget.Domain.Transactions;
using Models.Primitives;
using System.Transactions;
using System.Xml.Linq;

namespace Budget.Application.Statistics.Categories;

public sealed record CategoriesData : IStatisticalData
{
    public IReadOnlyList<CategoriesMonthlyData> MonthlyData => _monthlyData;

    private readonly List<CategoriesMonthlyData> _monthlyData = [];
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
        if (!_subcategories.Any() || 
            !_subcategories.SelectMany(s => s.Assignments).Any())
        {
            return;
        }

        var chronologigalMonths = _subcategories
            .SelectMany(s => s.Assignments)
            .Select(a => a.Month)
            .OrderBy(month => month.BegginingOfTheMonthEpoch)
            .ToList();

        var periodCreateResult = MonthPeriod.Create(chronologigalMonths.First(), chronologigalMonths.Last());

        if (periodCreateResult.IsFailure)
        {
            return;
        }

        var period = periodCreateResult.Value;

        foreach (var month in period.ToMonthsArray())
        {
            var categoriesMonthlyData = (from category in _categories
                let name = category.Name.Value
                let subcategories = _subcategories.Where(s => category.SubcategoriesId.Any(c => c == s.Id))
                let assignments = _subcategories.SelectMany(s => s.Assignments.Where(a => a.Month == month)).ToList()
                let spentAmount = new Money(assignments.Sum(a => a.ActualAmount.Amount), _budget.BaseCurrency)
                let assignedAmount = new Money(assignments.Sum(a => a.AssignedAmount.Amount), _budget.BaseCurrency)
                select new CategoryMonthlyData(
                    name,
                    MoneyModel.FromDomainModel(spentAmount),
                    MoneyModel.FromDomainModel(assignedAmount))).ToList();

            _monthlyData.Add(new CategoriesMonthlyData(month, categoriesMonthlyData));
        }
    }
}