using Budget.Application.Contracts.Models;
using Budget.Application.Statistics.Shared;
using Budget.Domain.Subcategories;
using Models.Primitives;

namespace Budget.Application.Statistics.Subcategories;

public sealed record SubcategoriesData : IStatisticalData
{
    public IReadOnlyCollection<SubcategoriesMonthlyData> MonthlyData => _monthlyData;

    private readonly List<SubcategoriesMonthlyData> _monthlyData = new();
    private readonly IEnumerable<Subcategory> _subcategories;
    private readonly Domain.Budgets.Budget _budget;

    public SubcategoriesData(IEnumerable<Subcategory> subcategories, Domain.Budgets.Budget budget)
    {
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
            var subcategoriesMonthlyData = (from subcategory in _subcategories
                    let name = subcategory.Name.Value
                    let assignments = subcategory.Assignments.Where(a => a.Month == month).ToList()
                    select new SubcategoryMonthlyData(
                        name,
                        MoneyModel.FromDomainModel(
                            new Money(assignments.Sum(a => a.AssignedAmount.Amount), _budget.BaseCurrency)),
                        MoneyModel.FromDomainModel(
                            new Money(assignments.Sum(a => a.ActualAmount.Amount), _budget.BaseCurrency))))
                .ToList();

            _monthlyData.Add(new SubcategoriesMonthlyData(month, subcategoriesMonthlyData));
        }
    }
}