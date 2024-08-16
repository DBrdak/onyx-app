using Abstractions.Messaging;
using Budget.Application.Categories.Models;
using Budget.Domain.Budgets;
using Budget.Domain.Categories;
using Budget.Domain.Subcategories;
using Models.Responses;

namespace Budget.Application.Categories.AddCategory;

internal sealed class AddCategoryCommandHandler : ICommandHandler<AddCategoryCommand, CategoryModel>
{
    private readonly ICategoryRepository _categoryRepository;
    private readonly IBudgetRepository _budgetRepository;

    public AddCategoryCommandHandler(ICategoryRepository categoryRepository, IBudgetRepository budgetRepository)
    {
        _categoryRepository = categoryRepository;
        _budgetRepository = budgetRepository;
    }

    // TODO: Add max categories validation (20 per budget (increased by 3 for each budget member))
    public async Task<Result<CategoryModel>> Handle(AddCategoryCommand request, CancellationToken cancellationToken)
    {
        var budgetGetResult = await _budgetRepository.GetCurrentBudgetAsync(cancellationToken);

        if (budgetGetResult.IsFailure)
        {
            return budgetGetResult.Error;
        }

        var budget = budgetGetResult.Value;

        var categoriesGetResult = await _categoryRepository.GetAllAsync(cancellationToken);

        if (categoriesGetResult.IsFailure)
        {
            return categoriesGetResult.Error;
        }

        var categories = categoriesGetResult.Value.ToList();

        var isMaxCategoriesCountReached = categories.Count >= budget.MaxCategories;

        if (isMaxCategoriesCountReached)
        {
            return AddCategoryErrors.MaxCategoryNumberReached;
        }
        
        var categoryCreateResult = Category.Create(request.Name, new(request.BudgetId));

        if (categoryCreateResult.IsFailure)
        {
            return Result.Failure<CategoryModel>(categoryCreateResult.Error);
        }

        var category = categoryCreateResult.Value;

        var categoryIsNotUniqueResult = categories.Any(c => c.Name == category.Name);

        if (categoryIsNotUniqueResult)
        {
            return AddCategoryErrors.CategoryAlreadyExistsError;
        }

        var categoryAddResult = await _categoryRepository.AddAsync(category, cancellationToken);

        if (categoryAddResult.IsFailure)
        {
            return categoryAddResult.Error;
        }

        category = categoryAddResult.Value;

        return CategoryModel.FromDomainModel(category, []);
    }
}