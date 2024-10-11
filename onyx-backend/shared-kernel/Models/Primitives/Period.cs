using Models.Responses;

namespace Models.Primitives;

public sealed record Period
{
    public long Start { get; init; }
    public long End { get; init; }

    private Period(long start, long end)
    {
        Start = start;
        End = end;
    }

    public static Result<Period> Create(DateTime start, DateTime end, long? maxPeriod = null)
    {
        var startTicks = start.ToUniversalTime().Ticks;
        var endTicks = end.ToUniversalTime().Ticks;

        if (start > end)
        {
            return new Error("Period.StartGreaterThanEnd", "Start date connot be greater than end date");
        }

        if (maxPeriod.HasValue && endTicks - startTicks > maxPeriod)
        {
            return new Error("Period.PeriodTooLong", "Period is too long");
        }

        return new Period(startTicks, endTicks);
    }
}