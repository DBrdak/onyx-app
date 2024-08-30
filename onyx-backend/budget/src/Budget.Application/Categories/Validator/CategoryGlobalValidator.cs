using Budget.Domain.Budgets;
using Budget.Domain.Categories;
using Budget.Domain.Subcategories;
using Models.Responses;

namespace Budget.Application.Categories.Validator;

internal sealed class CategoryGlobalValidator
{
    private readonly IBudgetRepository _budgetRepository;

    public CategoryGlobalValidator(IBudgetRepository budgetRepository)
    {
        _budgetRepository = budgetRepository;
    }

    public async Task<Result> Validate(Category category, CancellationToken cancellationToken)
    {
        var budgetGetResult = await _budgetRepository.GetCurrentBudgetAsync(cancellationToken);

        if (budgetGetResult.IsFailure)
        {
            return budgetGetResult.Error;
        }

        var budget = budgetGetResult.Value;

        var isUnknownCategory = category.SubcategoriesId.Any(sub => sub == budget.UnknownSubcategoryId);

        return Result.FromBool(
            !isUnknownCategory,
            CategoryValidationErrors.IsUnknownCategoryError);
    }
}