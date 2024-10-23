using Models.Responses;

namespace Budget.Application.Categories.RemoveCategory;

internal sealed class RemoveCategoriesErrors
{
    public static Error MustBeEmpty => new(
        "RemoveCategory.MustBeEmpty",
        "Delete forbidden - category must not contain any subcategories");
}