using Budget.Domain.Budgets;
using Budget.Domain.Categories;
using Budget.Domain.Subcategories;
using Models.DataTypes;

namespace Budget.Domain.Tests.Subcategories;

internal sealed class SubcategoryData
{
    public const string ValidName = "ValidSubcategoryName";
    public const string InvalidName = "Inva@lidSubcategoryName!";

    public const string NewValidName = "New valid subcategory name";
    public const string ValidDescription = "This is a valid description.";
    public static readonly string InvalidDescription = new('A', 256);

    public static Money ValidAssignmentAmount => new Money(100, Currency.Usd);
    public static Money InvalidAssignmentAmount => new(-50, Currency.Usd);

    public static Money ValidTargetAmount => new Money(1000, Currency.Usd);
    public static Money InvalidTargetAmount => new Money(-1000, Currency.Usd);

    public static int ValidMonth = DateTime.Now.Month;
    public static int ValidYear = DateTime.Now.Year;

    public static BudgetId ValidBudgetId = new ();
    public static BudgetId GenerateValidBudgetId => new ();

    public static Category ExampleCategory => Category.Create("c", ValidBudgetId).Value;
    public static Subcategory ExampleSubcategory => ExampleCategory.NewSubcategory(ValidName).Value;

    public static MonthDate ValidMonthDate => MonthDate.Create(ValidMonth, ValidYear).Value;
    public static MonthDate FutureMonthDate => MonthDate.Create(ValidMonth + 2, ValidYear).Value;
}