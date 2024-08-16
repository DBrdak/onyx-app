using Models.Responses;

namespace Budget.Application.Transactions.GetTransactions;

public sealed record GetTransactionQueryRequest
{
    public string Value { get; init; }

    private GetTransactionQueryRequest(string value) => Value = value;

    public static readonly GetTransactionQueryRequest All = new(nameof(All));
    public static readonly GetTransactionQueryRequest Counterparty = new(nameof(Counterparty));
    public static readonly GetTransactionQueryRequest Account = new(nameof(Account));
    public static readonly GetTransactionQueryRequest Subcategory = new(nameof(Subcategory));

    internal static readonly IReadOnlyCollection<GetTransactionQueryRequest> AllValues =
        new List<GetTransactionQueryRequest>
        {
            All,
            Counterparty,
            Account,
            Subcategory
        };

    internal static Result<GetTransactionQueryRequest> FromRequest(GetTransactionsQuery request) =>
        request switch
        {
            _ when request.AccountId.HasValue &&
                   !string.IsNullOrWhiteSpace(request.AccountId.Value.ToString()) => Account,
            _ when request.SubcategoryId.HasValue &&
                   !string.IsNullOrWhiteSpace(request.SubcategoryId.Value.ToString()) => Subcategory,
            _ when request.CounterpartyId.HasValue &&
                   !string.IsNullOrWhiteSpace(request.CounterpartyId.Value.ToString()) => Counterparty,
            _ => All,
        };
}