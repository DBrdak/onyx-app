using Abstractions.Messaging;
using Budget.Domain.Budgets;
using Budget.Domain.Categories;
using Budget.Domain.Subcategories;
using Budget.Domain.Transactions;
using Models.Primitives;
using Models.Responses;

namespace Budget.Application.Statistics.Categories.GetCategoryStats;

internal sealed class GetCategoryStatsQueryHandler : IQueryHandler<GetCategoryStatsQuery, CategoriesStatistics>
{
    private readonly IBudgetRepository _budgetRepository;
    private readonly ICategoryRepository _categoryRepository;
    private readonly ITransactionRepository _transactionRepository;
    private readonly ISubcategoryRepository _subcategoryRepository;
    private const int maxFilterPeriodMonths = 12;

    public GetCategoryStatsQueryHandler(
        IBudgetRepository budgetRepository,
        ICategoryRepository categoryRepository,
        ITransactionRepository transactionRepository,
        ISubcategoryRepository subcategoryRepository)
    {
        _budgetRepository = budgetRepository;
        _categoryRepository = categoryRepository;
        _transactionRepository = transactionRepository;
        _subcategoryRepository = subcategoryRepository;
    }

    public async Task<Result<CategoriesStatistics>> Handle(GetCategoryStatsQuery request, CancellationToken cancellationToken)
    {
        var fromCreateResult = MonthDate.Create(request.FromMonth, request.FromYear);
        var toCreateResult = MonthDate.Create(request.ToMonth, request.ToYear);

        if (Result.Aggregate([fromCreateResult, toCreateResult]) is var dateResult && dateResult.IsFailure)
        {
            return dateResult.Error;
        }

        var periodCreateResult = MonthPeriod.Create(fromCreateResult.Value, toCreateResult.Value, maxFilterPeriodMonths);

        if (periodCreateResult.IsFailure)
        {
            return periodCreateResult.Error;
        }

        var period = periodCreateResult.Value;

        var (budgetGetTask, categoiresGetTask, transactionsGetTask) = 
            (_budgetRepository.GetCurrentBudgetAsync(cancellationToken), 
            _categoryRepository.GetAllAsync(cancellationToken),
            _transactionRepository.GetForPeriodAsync(period.ToDatePeriod(), cancellationToken));

        await Task.WhenAll(budgetGetTask, categoiresGetTask, transactionsGetTask);

        var (budgetResult, categoriesResult, transactionsGetResult) = 
            (budgetGetTask.Result, categoiresGetTask.Result, transactionsGetTask.Result);

        if (Result.Aggregate([budgetResult, categoriesResult, transactionsGetResult]) is var result && result.IsFailure)
        {
            return result.Error;
        }

        var (budget, categories, transactions) = (budgetResult.Value, categoriesResult.Value.ToList(), transactionsGetResult.Value);

        var subcategoriesGetResult = await _subcategoryRepository.GetManyByIdAsync(
            categories.SelectMany(c => c.SubcategoriesId),
            cancellationToken);

        if (subcategoriesGetResult.IsFailure)
        {
            return subcategoriesGetResult.Error;
        }

        var subcategories = subcategoriesGetResult.Value;

        var stats = new CategoriesStatistics(transactions, categories, subcategories, period, budget);

        stats.Calculate();

        return stats;
    }
}
