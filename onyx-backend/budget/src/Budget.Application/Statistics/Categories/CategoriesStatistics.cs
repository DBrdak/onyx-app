using Budget.Application.Subcategories.Models;
using Budget.Domain.Categories;
using Budget.Domain.Subcategories;
using Budget.Domain.Transactions;
using Models.Primitives;

namespace Budget.Application.Statistics.Categories;

public sealed record CategoriesStatistics : IStatistics
{
    public IReadOnlyList<CategoryStatistics> CategoriesStats => _categoriesStats;

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
    }

    public void Calculate()
    {
        foreach (var category in _categories)
        {
            var name = category.Name.Value;
            var id = category.Id.Value;
            var subcategories = _subcategories.Where(s => category.SubcategoriesId.Any(c => c == s.Id));
            var totalSpendings = new Money(
                _transactions.Where(
                        t => subcategories.Any(
                            s => s.Id == t.SubcategoryId 
                                 && _period.Contains(t.TransactedAt)))
                .Select(t => t.BudgetAmount).Sum(x => x.Amount), _budget.BaseCurrency);
            var assignments = _subcategories.SelectMany(s => s.Assignments.Where(a => a.Month.IsInPeriod(_period)));
            var totalAssignedAmount = new Money(assignments.Sum(a => a.AssignedAmount.Amount), _budget.BaseCurrency);

            var monthStats = _transactions
                .Where(t => subcategories.Any(s => s.Id == t.SubcategoryId) && _period.Contains(t.TransactedAt))
                .GroupBy(t => MonthDate.FromDateTime(t.TransactedAt).Value)
                .Select(g => new CategoryMonthStats(
                    g.Key,
                    new Money(g.Sum(x => x.BudgetAmount.Amount), _budget.BaseCurrency),
                    new Money(subcategories.SelectMany(s => s.Assignments.Where(a => a.Month == g.Key)).Sum(a => a.AssignedAmount.Amount), _budget.BaseCurrency)));

            _categoriesStats.Add(
                new CategoryStatistics(
                    id,
                    name,
                    totalSpendings,
                    totalAssignedAmount,
                    monthStats,
                    _subcategories.Select(SubcategoryModel.FromDomainModel)));
        }
    }
}

public record CategoryStatistics(
    Guid CategoryId,
    string CategoryName,
    Money TotalAssignment,
    Money TotalSpending,
    IEnumerable<CategoryMonthStats> MonthStats,
    IEnumerable<SubcategoryModel> Subcategories);

public sealed record CategoryMonthStats(MonthDate Month, Money SpentAmount, Money AssignedAmount);