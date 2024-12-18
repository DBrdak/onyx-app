using Budget.Domain.Accounts;
using Budget.Domain.Budgets;
using Budget.Domain.Counterparties;
using Budget.Domain.Subcategories;
using Budget.Domain.Tests.Accounts;
using Budget.Domain.Tests.Counterparties;
using Budget.Domain.Tests.Subcategories;
using Budget.Domain.Transactions;
using System.Reflection;
using Budget.Domain.Categories;
using Models.Primitives;

namespace Budget.Domain.Tests.Transactions;

internal sealed class TransactionData
{
    public static DateTime MinimumValidPastDateTime => MockMinimumValidPastDateTime();

    private static DateTime MockMinimumValidPastDateTime()
    {
        var assembly = typeof(Transaction).Assembly;
        var dateTimeConstantsType = assembly.GetType("Budget.Domain.Shared.Constants.DateTimeConstants", throwOnError: true);

        var fieldInfo = dateTimeConstantsType?.GetField(
            "MinimumValidPastDateTime",
            BindingFlags.Static | BindingFlags.NonPublic);

        if (fieldInfo == null)
        {
            throw new InvalidOperationException("Field 'MinimumValidPastDateTime' not found.");
        }

        return (DateTime)fieldInfo.GetValue(null);
    }

    public static BudgetId ValidBudgetId => new();

    public static Money ValidAmount => new(-100, Currency.Usd);
    public static Money ValidInflowAmount => new(100, Currency.Usd);
    public static Money InvalidAmount => new(0, Currency.Usd);

    public static Money ValidOriginalAmount => new(-80, Currency.Eur);
    public static Money ValidConvertedAmount => new(-100, Currency.Usd);

    public static DateTime ValidTransactedAt => DateTime.UtcNow.AddDays(-1);
    public static DateTime FutureTransactedAt => DateTime.UtcNow.AddDays(1);
    public static DateTime InvalidPastDate => MinimumValidPastDateTime.AddSeconds(-1);

    public static string ValidCounterpartyName => "Valid counterparty";
    public static string ValidPayeeType => "Payee";
    public static string ValidPayerType => "Payer";

    public static string ValidSubcategoryName => "Valid subcategory";

    public static Money ValidBudgetAmount => new(-100, Currency.Usd);

    public static Account ExampleAccount => AccountData.Account;

    public static Subcategory ExampleSubcategory => SubcategoryData.ExampleSubcategory;
    public static Subcategory UnknownSubcategory =>
        Category.Create("Uncategorized", ValidBudgetId).Value.NewSubcategory("Unknown").Value;

    public static Counterparty ExamplePayee => CounterpartyData.ExamplePayee;

    public static Counterparty ExamplePayer => CounterpartyData.ExamplePayer;

    public static TransactionFactory GetTransactionFactory()
    {
        return new TransactionFactory(ExampleAccount, ValidBudgetId);
    }
}