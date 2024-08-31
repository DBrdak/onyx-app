using Models.Responses;

namespace Budget.Application.Transactions.GetTransactions;

internal sealed record GetTransactionQueryRequest
{
    public string Entity { get; init; }
    public DateTime Date { get; init; }
    public TransactionQueryPeriod Period { get; init; }

    private GetTransactionQueryRequest(string entity, DateTime date, TransactionQueryPeriod period)
    {
        Entity = entity;
        Date = date;
        Period = period;
    }

    private static GetTransactionQueryRequest All(
        DateTime date,
        TransactionQueryPeriod period) =>
        new(
            nameof(All),
            date,
            period);
    private static GetTransactionQueryRequest Counterparty(
        DateTime date,
        TransactionQueryPeriod period) =>
        new(
            nameof(Counterparty),
            date,
            period);
    private static GetTransactionQueryRequest Account(
        DateTime date,
        TransactionQueryPeriod period) =>
        new(
            nameof(Account),
            date,
            period);
    private static GetTransactionQueryRequest Subcategory(
        DateTime date,
        TransactionQueryPeriod period) =>
        new(
            nameof(Subcategory),
            date,
            period);

    public static readonly string AllEntity = nameof(All);
    public static readonly string CounterpartyEntity = nameof(Counterparty);
    public static readonly string AccountEntity = nameof(Account);
    public static readonly string SubcategoryEntity = nameof(Subcategory);

    internal static Result<GetTransactionQueryRequest> FromRequest(GetTransactionsQuery request)
    {
        var period = TransactionQueryPeriod.FromString(request.Period);
        var isValidDate = DateTime.TryParse(request.Date, out var date);

        if (!isValidDate)
        {
            date = DateTime.UtcNow.ToLocalTime();
        }

        return request switch
        {
            _ when request.AccountId.HasValue &&
                   !string.IsNullOrWhiteSpace(request.AccountId.Value.ToString()) => Account(date, period),
            _ when request.SubcategoryId.HasValue &&
                   !string.IsNullOrWhiteSpace(request.SubcategoryId.Value.ToString()) => Subcategory(date, period),
            _ when request.CounterpartyId.HasValue &&
                   !string.IsNullOrWhiteSpace(request.CounterpartyId.Value.ToString()) => Counterparty(date, period),
            _ => All(date, period),
        };
    }
}