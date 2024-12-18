using Budget.Domain.Budgets;
using Budget.Domain.Counterparties;

namespace Budget.Domain.Tests.Counterparties;

internal sealed class CounterpartyData
{
    public const string ValidName = "Valid name";
    public const string NewValidName = "New valid-name";
    public const string InvalidName = "In,validName*!";
    public const string ValidTypePayee = "Payee";
    public const string ValidTypePayer = "Payer";
    public const string InvalidType = "Lol";
    public static Counterparty ExampleCounterparty => Counterparty.Create(ValidName, ValidTypePayee, new BudgetId()).Value;
    public static Counterparty ExamplePayee => Counterparty.Create(ValidName, ValidTypePayee, new BudgetId()).Value;
    public static Counterparty ExamplePayer => Counterparty.Create(ValidName, ValidTypePayer, new BudgetId()).Value;
}