using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Extensions;

public static class DateTimeExtensions
{
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
}