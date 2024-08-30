using Models.Responses;

namespace Budget.Application.Categories.Validator;

internal sealed class CategoryValidationErrors
{
    public static Error IsUnknownCategoryError =>
        new(
            "Subcategory.UnknownCategoryCannotBeEdited",
            "Unknown category is immutable");
}