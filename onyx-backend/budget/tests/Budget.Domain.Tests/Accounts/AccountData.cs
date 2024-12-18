using Budget.Domain.Accounts;
using Budget.Domain.Budgets;
using Models.Primitives;

namespace Budget.Domain.Tests.Accounts;

internal class AccountData
{
    public static string ValidName = "Test-Account 1";
    public static string NewValidName = "Test-Account 2";
    public static string ValidType = "Savings";
    public static string InvalidName = "*Invalid_Name!";
    public static string InvalidType = "Invalid Type";
    public static Money Balance = new(500, Currency.Usd);
    public static Money NewBalance = new(5500, Currency.Usd);
    public static BudgetId BudgetId = new(Guid.NewGuid());
    public static Account Account = Account.Create(ValidName, Balance, ValidType, BudgetId).Value;
}