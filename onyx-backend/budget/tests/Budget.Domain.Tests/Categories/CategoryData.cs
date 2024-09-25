using Budget.Domain.Budgets;
using Budget.Domain.Categories;

namespace Budget.Domain.Tests.Categories;

internal sealed class CategoryData
{
    public static readonly string ValidName = "Category 1";
    public static readonly string NewValidName = "Category 2";
    public static readonly string InvalidName = "}Category;1*";
    public static readonly string ValidSubcategoryName = "Subcategory 1";
    public static readonly string InvalidSubcategoryName = ";Subcątegory(1)";
    public static readonly Category ExampleCategory = Category.Create(ValidName, new BudgetId()).Value;
}