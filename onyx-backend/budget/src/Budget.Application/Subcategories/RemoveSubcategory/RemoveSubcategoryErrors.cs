using Models.Responses;

namespace Budget.Application.Subcategories.RemoveSubcategory;

internal sealed class RemoveSubcategoryErrors
{
    public static readonly Error UnknownSubcategoryNotFoundError = new(
        "RemoveSubcategory.UnknownSubcategoryNotFound",
        "Unknown subcategory not found");
}