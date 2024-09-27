using Models.Responses;

namespace Budget.Application.Transactions.GetTransactions;

internal static class GetTransactionErrors
{
    public static readonly Error InvalidDate = new ("GetTransaction.InvalidDate", "Provided date or dateRange is invalid");
    public static readonly Error InvalidQueryValues = new(
        "GetTransaction.InvalidQueryValues",
        "Invalid values for query");
    public static readonly Error QueryIsNull = new (
        "GetTransaction.QueryIsNull",
        "Pass the query");
    public static readonly Error NullFilters = new (
        "GetTransaction.NullFilters",
        "You need to specify either date + period or dateRangeStart + dateRangeEnd");
}