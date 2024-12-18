using Budget.Application.Contracts.Models;
using Budget.Application.Statistics.Shared;
using Budget.Domain.Counterparties;
using Budget.Domain.Subcategories;
using Models.Primitives;

namespace Budget.Application.Statistics.Subcategories;

public sealed record SubcategoriesData : IStatisticalData
{
    public IReadOnlyDictionary<string, IEnumerable<SubcategoryMonthlyData>> Data => _data;

    private readonly Dictionary<string, IEnumerable<SubcategoryMonthlyData>> _data = [];
    private readonly IEnumerable<Subcategory> _subcategories;
    private readonly Domain.Budgets.Budget _budget;

    public SubcategoriesData(IEnumerable<Subcategory> subcategories, Domain.Budgets.Budget budget)
    {
        _subcategories = subcategories;
        _budget = budget;
    }

    public void Calculate()
    {
        foreach (var subcategory in _subcategories)
        {
            var groupedAssignments = subcategory.Assignments
                .GroupBy(a => a.Month)
                .OrderBy(g => g.Key.BegginingOfTheMonthEpoch)
                .ToList();

            if (!groupedAssignments.Any())
            {
                _data.TryAdd(subcategory.Name.Value.ToLower(), []);
                continue;
            }

            var monthlyData = groupedAssignments.Select(
                group => new SubcategoryMonthlyData(
                    MonthModel.FromDomainModel(group.Key),
                    MoneyModel.FromDomainModel(
                        new Money(group.Sum(a => a.ActualAmount.Amount), _budget.BaseCurrency)),
                    MoneyModel.FromDomainModel(
                        new Money(group.Sum(a => a.AssignedAmount.Amount), _budget.BaseCurrency))))
            .ToList();

            if (_data.TryAdd(subcategory.Name.Value.ToLower(), monthlyData))
            {
                continue;
            }

            var data = _data[subcategory.Name.Value.ToLower()].ToList();

            foreach (var x in data)
            {
                foreach (var y in monthlyData.Where(y => x.Month == y.Month))
                {
                    x.AssignedAmount.Amount += y.AssignedAmount.Amount;
                    x.SpentAmount.Amount += y.SpentAmount.Amount;
                }
            }

            _data[subcategory.Name.Value.ToLower()] = data;
        }
    }
}