namespace Extensions;

public static class DateTimeExtensions
{
    public static bool IsLeapYear(this DateTime date) =>
        date.Year % 4 == 0;

    public static int DaysInMonth(this DateTime date)
    {
        switch (date.Month)
        {
            case <= 7 when date.Month.IsOdd():
            case > 7 when date.Month.IsEven():
                return 31;
            case 2:
                return date.IsLeapYear() ? 29 : 28;
            default:
                return 30;
        }
    }

    public static DateTime BegginingOfTheWeek(this DateTime date)
    {
        var currentDay = date.DayOfWeek;

        while (currentDay != DayOfWeek.Monday)
        {
            date = date.AddDays(-1);
            currentDay = date.DayOfWeek;
        }

        return new(date.Year, date.Month, date.Day);
    }

    public static DateTime BegginingOfTheMonth(this DateTime date)
    {
        var currentDay = date.Day;

        while (currentDay != 1)
        {
            date = date.AddDays(-1);
            currentDay = date.Day;
        }

        return new(date.Year, date.Month, date.Day);
    }
    public static DateTime EndOfTheWeek(this DateTime date)
    {
        var currentDay = date.DayOfWeek;

        while (currentDay != DayOfWeek.Sunday)
        {
            date = date.AddDays(1);
            currentDay = date.DayOfWeek;
        }

        return new(date.Year, date.Month, date.Day);
    }

    public static DateTime EndOfTheMonth(this DateTime date)
    {
        var currentDay = date.Day;

        while (currentDay != date.DaysInMonth())
        {
            date = date.AddDays(1);
            currentDay = date.Day;
        }

        return new(date.Year, date.Month, date.Day);
    }
}