using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
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

    public static Result<Period> Create(long start, long end)
    {
        if (start > end)
        {
            return new Error("Period.StartGreaterThanEnd", "Start data connot be greater than end date");
        }

        return new Period(start, end);
    }
}