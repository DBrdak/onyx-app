using Extensions;
using Models.Primitives;
using Models.Responses;

namespace Budget.Application.Transactions.GetTransactions;

internal sealed record TransactionQueryPeriod
{
    public string Value { get; init; }
    private static readonly Error invalidPeriodError = new(
        "TransactionQueryPeriod.InvalidValue",
        "Invalid transaction query period");

    private TransactionQueryPeriod(string value) => Value = value;

    private static readonly TransactionQueryPeriod day = new(nameof(day));
    private static readonly TransactionQueryPeriod week = new(nameof(week));
    private static readonly TransactionQueryPeriod month = new(nameof(month));
    private static readonly TransactionQueryPeriod last7Days = new(nameof(last7Days));
    private static readonly TransactionQueryPeriod last30Days = new(nameof(last30Days));
    public static readonly TransactionQueryPeriod DateRange = new(nameof(DateRange));

    private static readonly IReadOnlyCollection<TransactionQueryPeriod> all =
    [
        day, week, month, last7Days, last30Days, DateRange
    ];

    public static TransactionQueryPeriod FromString(string? period) =>
        all.FirstOrDefault(p => string.Equals(p.Value, period, StringComparison.CurrentCultureIgnoreCase)) ??
        DateRange;

    public Period ToPeriod(DateTime date) =>
        this switch
        {
            _ when this == day => Period.Create(date.StartOfTheDay(), date.EndOfTheDay()).Value,
            _ when this == week => Period.Create(date.BegginingOfTheWeek(), date.EndOfTheWeek()).Value,
            _ when this == month => Period.Create(date.BegginingOfTheMonth(), date.EndOfTheMonth()).Value,
            _ when this == last7Days => Period.Create(date.StartOfTheDay().AddDays(-7), date).Value,
            _ when this == last30Days => Period.Create(date.StartOfTheDay().AddDays(-30), date).Value,
            _ => Period.Create(DateTime.UtcNow.BegginingOfTheMonth(), DateTime.UtcNow.EndOfTheMonth()).Value,
        };
}