namespace Budget.Domain.Shared.Constants;

internal static class DateTimeConstants
{
    internal static readonly DateTime MinimumValidPastDateTime = DateTime.UtcNow.AddYears(-5);
}