using Models.Primitives;

namespace Budget.Application.Contracts.Models;

public sealed record MonthModel
{
    public string MonthName { get; init; }
    public int Month { get; init; }
    public int Year { get; init; }

    private MonthModel(string monthName, int month, int year)
    {
        MonthName = monthName;
        Month = month;
        Year = year;
    }

    internal static MonthModel FromDomainModel(MonthDate monthDate) =>
        new(GetMonthName(monthDate), monthDate.Month, monthDate.Year);

    private static string GetMonthName(MonthDate month) => $"{AllMonthNames.ElementAt(month.Month - 1)} {month.Year}";

    public static IReadOnlyCollection<string> AllMonthNames =>
    [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];
}