using Budget.Application.Subcategories.Models;
using Models.Responses;

namespace Budget.Application.Subcategories.AddSubcategory;

internal sealed class SubcategoryAddErrors
{
    public static Result<SubcategoryModel> SubcategoryAlreadyExist =>
        new Error(
            "SubcategoryAdd.SubcategoryAlreadyExist",
            "Subcategory with given name already exist");
}