using Budget.Domain.Accounts;
using Budget.Domain.Subcategories;
using Models.Responses;

namespace Budget.Domain.Transactions;

public sealed class TransactionService
{
    public static Result RemoveTransaction(
        Transaction transaction, 
        Account account, 
        Subcategory? subcategory)
    {
        var results = new[]
        {
            account.RemoveTransaction(transaction),
            subcategory?.RemoveTransaction(transaction)
        };

        return results.FirstOrDefault(r => r is { IsFailure: true }) ?? Result.Success();
    }

    public static Result SetSubcategory(
        Transaction transaction,
        Subcategory subcategory,
        Subcategory unknownSubcategory) =>
        Result.Aggregate([
            subcategory.Transact(transaction), 
            unknownSubcategory.RemoveTransaction(transaction)
        ]);
}