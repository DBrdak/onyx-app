using AWS.Publisher.Terminal;

namespace AWS.Publisher.Extensions;

internal static class Delegate
{
    public static void TryCatch(Action func, string callbackMessage)
    {
        try
        {
            func.Invoke();
        }
        catch
        {
            Printer.PrintLine(callbackMessage, ConsoleColor.Red);
            Environment.Exit(1);
        }
    }
    public static async Task TryCatchAsync(Func<Task> func, string callbackMessage)
    {
        try
        {
            await func.Invoke();
        }
        catch
        {
            Printer.PrintLine(callbackMessage, ConsoleColor.Red);
            Environment.Exit(1);
        }
    }
    public static void TryCatch<TResult>(Func<TResult> func, string callbackMessage, out TResult result)
    {
        try
        {
            result = func.Invoke();
        }
        catch
        {
            Printer.PrintLine(callbackMessage, ConsoleColor.Red);
            Environment.Exit(1);
            result = default;
        }
    }
    public static async Task TryCatchAsync<TResult>(Func<Task<TResult>> func, string callbackMessage, out TResult result)
    {
        try
        {
            result = await func.Invoke();
        }
        catch
        {
            Printer.PrintLine(callbackMessage, ConsoleColor.Red);
            Environment.Exit(1);
            result = default;
        }
    }

    public static void TryCatch(Action func, Func<Exception, string> callbackMessage)
    {
        try
        {
            func.Invoke();
        }
        catch (Exception ex)
        {
            Printer.PrintLine(callbackMessage.Invoke(ex), ConsoleColor.Red);
            Environment.Exit(1);
        }
    }
    public static async Task TryCatchAsync(Func<Task> func, Func<Exception, string> callbackMessage)
    {
        try
        {
            await func.Invoke();
        }
        catch (Exception ex)
        {
            Printer.PrintLine(callbackMessage.Invoke(ex), ConsoleColor.Red);
            Environment.Exit(1);
        }
    }
    public static void TryCatch<TResult>(Func<TResult> func, Func<Exception, string> callbackMessage, out TResult result)
    {
        try
        {
            result = func.Invoke();
        }
        catch (Exception ex)
        {
            Printer.PrintLine(callbackMessage.Invoke(ex), ConsoleColor.Red);
            Environment.Exit(1);
            result = default;
        }
    }
    public static async Task TryCatchAsync<TResult>(Func<Task<TResult>> func, Func<Exception, string> callbackMessage, out TResult result)
    {
        try
        {
            result = await func.Invoke();
        }
        catch (Exception ex)
        {
            Printer.PrintLine(callbackMessage.Invoke(ex), ConsoleColor.Red);
            Environment.Exit(1);
            result = default;
        }
    }
}