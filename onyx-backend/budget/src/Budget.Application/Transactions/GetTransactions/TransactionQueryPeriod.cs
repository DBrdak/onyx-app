using Extensions;
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

    private static readonly IReadOnlyCollection<TransactionQueryPeriod> all =
    [
        day, week, month, last7Days, last30Days
    ];

    public static TransactionQueryPeriod FromString(string? period) =>
        all.FirstOrDefault(p => string.Equals(p.Value, period, StringComparison.CurrentCultureIgnoreCase)) ??
        day;

    public long ToDateTimeTicksSearchFrom(DateTime date)
    {
        return this switch
        {
            _ when this == day => new DateTime(date.Year, date.Month, date.Day, 0, 0, 0).Ticks,
            _ when this == week => date.BegginingOfTheWeek().Ticks,
            _ when this == month => date.BegginingOfTheMonth().Ticks,
            _ when this == last7Days => date.AddDays(-7).Ticks,
            _ when this == last30Days => date.AddDays(-30).Ticks,
            _ => date.Ticks
        };
    }
}