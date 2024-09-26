﻿using Extensions;
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

    private static readonly IReadOnlyCollection<TransactionQueryPeriod> all =
    [
        day, week, month, last7Days, last30Days
    ];

    public static TransactionQueryPeriod FromString(string? period) =>
        all.FirstOrDefault(p => string.Equals(p.Value, period, StringComparison.CurrentCultureIgnoreCase)) ??
        day;

    public Period ToPeriod(DateTime date) =>
        this switch
        {
            _ when this == day => Period.Create(
                    new DateTime(
                        date.Year,
                        date.Month,
                        date.Day,
                        0,
                        0,
                        0).Ticks,
                    new DateTime(
                        date.Year,
                        date.Month,
                        date.Day + 1,
                        0,
                        0,
                        0).Ticks)
                .Value,
            _ when this == week => Period.Create(date.BegginingOfTheWeek().Ticks, date.EndOfTheWeek().Ticks).Value,
            _ when this == month => Period.Create(date.BegginingOfTheMonth().Ticks, date.EndOfTheMonth().Ticks).Value,
            _ when this == last7Days => Period.Create(date.AddDays(-7).Ticks, date.Ticks).Value,
            _ when this == last30Days => Period.Create(date.AddDays(-30).Ticks, date.Ticks).Value,
            _ => Period.Create(DateTime.UtcNow.BegginingOfTheMonth().Ticks, DateTime.UtcNow.EndOfTheMonth().Ticks).Value,
        };
}