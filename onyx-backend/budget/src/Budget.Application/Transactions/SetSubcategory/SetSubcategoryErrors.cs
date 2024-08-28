using Models.Responses;

namespace Budget.Application.Transactions.SetSubcategory;

internal sealed class SetSubcategoryErrors
{
    public static readonly Error UnknownSubcategoryNotFoundError = new (
        "TransactionSetSubcategory.UnknownSubcategoryNotFound",
        "Unknown subcategory not found");
}