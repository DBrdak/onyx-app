using System.Collections.ObjectModel;
using System.Diagnostics.CodeAnalysis;
using Budget.Domain.Categories;
using Budget.Domain.Subcategories;
using Budget.Domain.Transactions;
using Models.Primitives;
using MongoDB.Bson;

namespace Budget.Application.Statistics.Categories;

public sealed record CategoriesStatistics : IStatistics
{
    public IReadOnlyList<CategoryStatistics> CategoriesStats => _categoriesStats;
    public Money TotalAssigned { get; private set; }
    public Money TotalSpentAmount { get; private set; }

    private readonly List<CategoryStatistics> _categoriesStats = [];
    private readonly IEnumerable<Transaction> _transactions;
    private readonly IEnumerable<Category> _categories;
    private readonly IEnumerable<Subcategory> _subcategories;
    private readonly Domain.Budgets.Budget _budget;
    private readonly MonthPeriod _period;

    internal CategoriesStatistics(
        IEnumerable<Transaction> transactions,
        IEnumerable<Category> categories,
        IEnumerable<Subcategory> subcategories,
        MonthPeriod period,
        Domain.Budgets.Budget budget)
    {
        _transactions = transactions;
        _categories = categories;
        _subcategories = subcategories;
        _period = period;
        _budget = budget;
        TotalAssigned = new Money(0, _budget.BaseCurrency);
        TotalSpentAmount = new Money(0, _budget.BaseCurrency);
    }

    public void Calculate()
    {
        foreach (var category in _categories)
        {
            var name = category.Name.Value;
            var id = category.Id.Value;
            var subcategories = _subcategories.Where(s => category.SubcategoriesId.Any(c => c == s.Id));
            var outcome = new Money(_transactions.Where(t => subcategories.Any(s => s.Id == t.SubcategoryId))
                .Select(t => t.BudgetAmount).Sum(x => x.Amount), _budget.BaseCurrency);
            var assignments = _subcategories.SelectMany(s => s.Assignments.Where(a => a.Month.IsInPeriod(_period)));
            var assignedAmount = new Money(assignments.Sum(a => a.AssignedAmount.Amount), _budget.BaseCurrency);

            _categoriesStats.Add(new CategoryStatistics(id, name, outcome, assignedAmount));
        }

        TotalAssigned = new Money(_categoriesStats.Sum(x => x.AssignedAmount.Amount), _budget.BaseCurrency);
        TotalSpentAmount = new Money(_categoriesStats.Sum(x => x.SpentAmount.Amount), _budget.BaseCurrency);
    }
}

public record CategoryStatistics(Guid CategoryId, string CategoryName, Money SpentAmount, Money AssignedAmount);