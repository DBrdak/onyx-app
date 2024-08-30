using Models.Responses;

namespace Budget.Application.Transactions.AddTransaction;

internal sealed class AddTransactionErrors
{
    public static readonly Error UnknownSubcategoryCannotBeAssigned = new(
        "AddTransaction.UnknownSubcategoryCannotBeAssigned",
        "Cannot assign unknown subcategory to transaction");
}