using Budget.Domain.Budgets;
using Budget.Domain.Subcategories;
using Models.Responses;

namespace Budget.Application.Subcategories.Validator;

internal sealed class SubcategoryGlobalValidator
{
    private readonly IBudgetRepository _budgetRepository;

    public SubcategoryGlobalValidator(IBudgetRepository budgetRepository)
    {
        _budgetRepository = budgetRepository;
    }

    public async Task<Result> Validate(SubcategoryId subcategoryId, CancellationToken cancellationToken)
    {
        var budgetGetResult = await _budgetRepository.GetCurrentBudgetAsync(cancellationToken);

        if (budgetGetResult.IsFailure)
        {
            return budgetGetResult.Error;
        }

        var budget = budgetGetResult.Value;

        var isUnknownSubcategory = budget.UnknownSubcategoryId == subcategoryId;

        return Result.FromBool(
            isUnknownSubcategory,
            SubcategoryValidationErrors.IsUnknownSubcategoryError);
    }
}