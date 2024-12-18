namespace Extensions;

public static class NumberExtensions
{
    public static bool IsEven(this int number) => number % 2 == 0;
    public static bool IsOdd(this int number) => number % 2 != 0;
}