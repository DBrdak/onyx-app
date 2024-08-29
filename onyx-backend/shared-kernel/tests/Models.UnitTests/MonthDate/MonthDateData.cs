using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.VisualStudio.TestPlatform.ObjectModel;

namespace Models.UnitTests.MonthDate;

public sealed class MonthDateData
{
    public static readonly (int Month, int Year)[] ValidMonthsYears =
    [
        (1, 1),
        (2, 2025),
        (3, 2021),
        (4, 2222),
        (5, 1998),
        (6, 123),
        (7, 23),
        (8, 555),
        (9, 11111),
        (10, 5),
        (11, 11),
        (12, 12)
    ];

    public static readonly (int Month, int Year)[] InvalidMonthsYears =
    [
        (21, -1),
        (20, -2025),
        (-3, -2222),
        (-4, -22222),
        (15, -2),
        (0, 0),
        (22, -1),
        (102, -1),
        (123, -1),
        (13, -1)
    ];

    public static readonly DataTypes.MonthDate ExampleEarlier = DataTypes.MonthDate.Create(1, 2024).Value;
    public static readonly DataTypes.MonthDate ExampleLater = DataTypes.MonthDate.Create(12, 2024).Value;
    public static readonly int ExamplesMonthsPositiveInterval = 11;
    public static readonly int ExamplesMonthsNegativeInterval = -ExamplesMonthsPositiveInterval;

    public static readonly int ExampleSummand = 1;
    public static readonly int ExampleSubtrahend = 1;

    public static readonly DataTypes.MonthDate ExampleSum = DataTypes.MonthDate.Create(1, 2025).Value;
    public static readonly DataTypes.MonthDate ExampleDiffrence = DataTypes.MonthDate.Create(11, 2024).Value;
    public static readonly DataTypes.MonthDate ExampleLaterIncrementation = DataTypes.MonthDate.Create(
        1,
        2025).Value;
    public static readonly DataTypes.MonthDate ExampleEarlierDecrementation = DataTypes.MonthDate.Create(
        12,
        2023).Value;

    public static readonly DateTime ContainedDate = new (2024, 11, 5);
    public static readonly DateTime NotContainedDate = new (2021, 5, 5);
}