using Models.Responses;

namespace Models.Primitives;

/// <summary>
/// Date type which represents specific month of the year. Date format is MM/YYYY.
/// </summary>
public sealed record MonthDate
{
    /// <summary>
    /// Index of the month, starting from 1
    /// </summary>
    public int Month { get; init; }
    public int Year { get; init; }
    public long BegginingOfTheMonthEpoch => new DateTimeOffset(Year, Month, 1, 0, 0, 0, TimeSpan.Zero).ToUnixTimeMilliseconds();
    private const int maxMonth = 12;
    private const int minMonth = 1;

    [Newtonsoft.Json.JsonConstructor]
    [System.Text.Json.Serialization.JsonConstructor]
    private MonthDate(int month, int year)
    {
        Month = month;
        Year = year;
    }    
    
    private MonthDate(DateTime date)
    {
        Month = date.Month;
        Year = date.Year;
    }


    public static Result<MonthDate> Create(int month, int year)
    {
        if (month is < minMonth or > maxMonth)
        {
            return Result.Failure<MonthDate>(
                new(
                    "MonthDate.InvalidMonthValue",
                    "Invalid month value"));
        }

        if (year < 0)
        {
            return Result.Failure<MonthDate>(
                new(
                    "MonthDate.InvalidYearValue",
                    "Invalid year value"));
        }

        return new MonthDate(month, year);
    }

    public static Result<MonthDate> FromDateTime(DateTime dateTime) => Create(dateTime.Month, dateTime.Year);

    public static MonthDate Current => new (DateTime.UtcNow.Month, DateTime.UtcNow.Year);

    public static int MonthsInterval(MonthDate later, MonthDate earlier)
    {
            var earlierTotalMonths = earlier.Month + earlier.Year * 12;
            var laterTotalMonths = later.Month + later.Year * 12;

            return laterTotalMonths - earlierTotalMonths;
        }

    public override string ToString() => $"{Month:00}/{Year}";

    public bool ContainsDate(DateTime date) => date.Month == Month && date.Year == Year;

    public bool IsInPeriod(Period period)
    {
        var start = new MonthDate(new DateTime(period.Start));
        var end = new MonthDate(new DateTime(period.End));

        return this >= start && this <= end;
    }

    public bool IsInPeriod(MonthPeriod period) => this >= period.Start && this <= period.End;

    public static int CalculateIntervalBetweenDates(MonthDate date1, MonthDate date2)
    {
        var totalMonths1 = date1.Year * 12 + date1.Month;
        var totalMonths2 = date2.Year * 12 + date2.Month;

        return Math.Abs(totalMonths2 - totalMonths1);
    }

    public static readonly IReadOnlyDictionary<int, string> MonthNames = new Dictionary<int,string>
    {
        {1, "January"},
        {2, "February"},
        {3, "March"},
        {4, "April"},
        {5, "May"},
        {6, "June"},
        {7, "July"},
        {8, "August"},
        {9, "September"},
        {10, "October"},
        {11, "November"},
        {12, "December"}
    };

    // Operators
    public static MonthDate operator ++(MonthDate date) =>
        date.Month == 12 ?
            new MonthDate(1, date.Year + 1) :
            new MonthDate(date.Month + 1, date.Year);

    public static MonthDate operator --(MonthDate date) =>
        date.Month == 1 ?
            new MonthDate(12, date.Year - 1) :
            new MonthDate(date.Month - 1, date.Year);

    public static MonthDate operator +(MonthDate date, int monthsToAdd)
    {
            var totalMonths = date.Year * 12 + date.Month;
            var newTotalMonths = totalMonths + monthsToAdd;

            var newYear = newTotalMonths / 12;
            var newMonth = newTotalMonths % 12;

            if (newMonth != 0)
            {
                return new(newMonth, newYear);
            }

            newYear--;
            newMonth = 12;

            return new(newMonth, newYear);
    }

    public static MonthDate operator -(MonthDate date, int monthsToSubstract)
    {
            var totalMonths = date.Year * 12 + date.Month;
            var newTotalMonths = totalMonths - monthsToSubstract;

            var newYear = newTotalMonths / 12;
            var newMonth = newTotalMonths % 12;

            if (newMonth != 0)
            {
                return new (newMonth, newYear);
            }

            newYear--;
            newMonth = 12;

            return new (newMonth, newYear);
    }

    public static bool operator <(MonthDate date1, MonthDate date2) =>
        date1.Year * 12 + date1.Month < date2.Year * 12 + date2.Month;

    public static bool operator >(MonthDate date1, MonthDate date2) =>
        date1.Year * 12 + date1.Month > date2.Year * 12 + date2.Month;

    public static bool operator <=(MonthDate date1, MonthDate date2) =>
        date1.Year * 12 + date1.Month <= date2.Year * 12 + date2.Month;

    public static bool operator >=(MonthDate date1, MonthDate date2) =>
        date1.Year * 12 + date1.Month >= date2.Year * 12 + date2.Month;
}