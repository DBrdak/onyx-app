using Models.Responses;

namespace Budget.Application.Subcategories.Validator;

internal sealed class SubcategoryValidationErrors
{
    public static Error UnknownSubcategoryError =>
        new(
            "Subcategory.UnknownSubcategoryCannotBeEdited",
            "Unknown subcategory is immutable");
}