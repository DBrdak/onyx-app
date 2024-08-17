using Models.Responses;

namespace Budget.Application.Categories.AddCategory;

internal sealed class AddCategoryErrors
{
    internal static readonly Error CategoryAlreadyExistsError = new(
        "AddCategory.AlreadyExists",
        "Category already exists");

    internal static readonly Error MaxCategoryNumberReached = new(
        "AddCategory.MaxCategoryNumberReached",
        "You already have maximum nuber of categories");
}