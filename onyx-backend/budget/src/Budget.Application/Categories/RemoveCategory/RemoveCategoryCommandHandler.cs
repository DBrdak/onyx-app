using Abstractions.Messaging;
using Budget.Domain.Categories;
using Budget.Domain.Subcategories;
using Models.Responses;

namespace Budget.Application.Categories.RemoveCategory;

internal sealed class RemoveCategoryCommandHandler : ICommandHandler<RemoveCategoryCommand>
{
    private readonly ICategoryRepository _categoryRepository;
    private readonly ISubcategoryRepository _subcategoryRepository;

    public RemoveCategoryCommandHandler(ICategoryRepository categoryRepository, ISubcategoryRepository subcategoryRepository)
    {
        _categoryRepository = categoryRepository;
        _subcategoryRepository = subcategoryRepository;
    }

    public async Task<Result> Handle(RemoveCategoryCommand request, CancellationToken cancellationToken)
    {
        var categoryGetResult = await _categoryRepository.GetByIdAsync(new (request.CategoryId), cancellationToken);

        if (categoryGetResult.IsFailure)
        {
            return Result.Failure(categoryGetResult.Error);
        }

        var category = categoryGetResult.Value;

        if (category.SubcategoriesId.Any())
        {
            return RemoveCategoriesErrors.MustBeEmpty;
        }

        return await _categoryRepository.RemoveAsync(category.Id, cancellationToken);
    }
}