using Models.Responses;

namespace Models.Primitives;

public sealed record MonthPeriod
{
    public MonthDate Start { get; init; }
    public MonthDate End { get; init; }

    private MonthPeriod(MonthDate start, MonthDate end)
    {
        Start = start;
        End = end;
    }

    public static Result<MonthPeriod> Create(MonthDate start, MonthDate end, int? maxPeriod = null)
    {
        if (start > end)
        {
            return new Error("MonthPeriod.StartGreaterThanEnd", "Start date connot be greater than end date");
        }

        if (maxPeriod.HasValue && MonthDate.CalculateIntervalBetweenDates(start, end) > maxPeriod)
        {
            return new Error("MonthPeriod.PeriodTooLong", "Period is too long");
        }

        return new MonthPeriod(start, end);
    }

    public Period ToDatePeriod() =>
        Period.Create(
            new DateTime(Start.Year, Start.Month, 1),
            new DateTime(End.Year, End.Month, 1)).Value;

    public bool Contains(DateTime date) =>
        date >= new DateTime(Start.Year, Start.Month, 1) &&
        date < new DateTime(End.Year, End.Month, 1).AddMonths(1);
}