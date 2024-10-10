using Models.Primitives;
using Models.Responses;

namespace Budget.Application.Transactions.GetTransactions;

internal sealed record GetTransactionQueryRequest
{
    public string Entity { get; init; }
    public DateTime? Date { get; init; }
    public Period? DateRange { get; init; }
    public TransactionQueryPeriod QueryPeriod { get; init; }

    private GetTransactionQueryRequest(
        string entity,
        DateTime? date,
        Period? dateRange,
        TransactionQueryPeriod queryPeriod)
    {
        Entity = entity;
        Date = date;
        QueryPeriod = queryPeriod;
        DateRange = dateRange;
    }

    private static GetTransactionQueryRequest All(
        DateTime date,
        TransactionQueryPeriod period) =>
        new(
            nameof(All),
            date,
            null,
            period);
    private static GetTransactionQueryRequest All(Period dateRange) =>
        new(
            nameof(All),
            null,
            dateRange,
            TransactionQueryPeriod.DateRange);
    private static GetTransactionQueryRequest Counterparty(
        DateTime date,
        TransactionQueryPeriod period) =>
        new(
            nameof(Counterparty),
            date,
            null,
            period);
    private static GetTransactionQueryRequest Counterparty(Period dateRange) =>
        new(
            nameof(Counterparty),
            null,
            dateRange,
            TransactionQueryPeriod.DateRange);
    private static GetTransactionQueryRequest Account(
        DateTime date,
        TransactionQueryPeriod period) =>
        new(
            nameof(Account),
            date,
            null,
            period);
    private static GetTransactionQueryRequest Account(Period dateRange) =>
        new(
            nameof(Account),
            null,
            dateRange,
            TransactionQueryPeriod.DateRange);
    private static GetTransactionQueryRequest Subcategory(
        DateTime date,
        TransactionQueryPeriod period) =>
        new(
            nameof(Subcategory),
            date,
            null,
            period);
    private static GetTransactionQueryRequest Subcategory(Period dateRange) =>
        new(
            nameof(Subcategory),
            null,
            dateRange,
            TransactionQueryPeriod.DateRange);

    public static readonly string AllEntity = nameof(All);
    public static readonly string CounterpartyEntity = nameof(Counterparty);
    public static readonly string AccountEntity = nameof(Account);
    public static readonly string SubcategoryEntity = nameof(Subcategory);

    internal static Result<GetTransactionQueryRequest> FromRequest(GetTransactionsQuery request)
    {
        Period? dateRange = null;
        var period = TransactionQueryPeriod.FromString(request.Period);
        var isValidDate = DateTime.TryParse(request.Date, out var date);
        var isValidStartDate = DateTime.TryParse(request.DateRangeStart, out var startDate);
        var isValidEndDate = DateTime.TryParse(request.DateRangeEnd, out var endDate);

        if (!isValidDate && (!isValidStartDate || !isValidEndDate))
        {
            return GetTransactionErrors.InvalidDate;
        }

        if (isValidStartDate && isValidEndDate)
        {
            var dateRangeCreateResult = Period.Create(
                startDate,
                endDate,
                TimeSpan.TicksPerDay * 365);

            if (dateRangeCreateResult.IsFailure)
            {
                return dateRangeCreateResult.Error;
            }

            dateRange = dateRangeCreateResult.Value;
        }

        return request switch
        {
            _ when request.AccountId.HasValue && dateRange is null &&
                   !string.IsNullOrWhiteSpace(request.AccountId.Value.ToString()) => Account(date, period),
            _ when request.SubcategoryId.HasValue && dateRange is null &&
                   !string.IsNullOrWhiteSpace(request.SubcategoryId.Value.ToString()) => Subcategory(date, period),
            _ when request.CounterpartyId.HasValue && dateRange is null &&
                   !string.IsNullOrWhiteSpace(request.CounterpartyId.Value.ToString()) => Counterparty(date, period),
            _ when request.AccountId.HasValue && dateRange is not null &&
                   !string.IsNullOrWhiteSpace(request.AccountId.Value.ToString()) => Account(dateRange),
            _ when request.SubcategoryId.HasValue && dateRange is not null &&
                   !string.IsNullOrWhiteSpace(request.SubcategoryId.Value.ToString()) => Subcategory(dateRange),
            _ when request.CounterpartyId.HasValue && dateRange is not null &&
                   !string.IsNullOrWhiteSpace(request.CounterpartyId.Value.ToString()) => Counterparty(dateRange),
            _ => dateRange is not null ? All(dateRange) : All(date, period),
        };
    }
}