using static AWS.Publisher.Terminal.Printer;

namespace AWS.Publisher.Configurations;

internal sealed class CurrentEnvironment
{
    public string Value { get; init; }

    private CurrentEnvironment(string value) => Value = value;

    public static CurrentEnvironment SetCurrentEnvironment(string[] args)
    {
        List<string> arguments = [.. args];

        while (true)
        {
            try
            {
                return arguments[0] switch
                {
                    var env when env.ToLower() == Environments.Development => new(Environments.Development),
                    var env when env.ToLower() == Environments.Production => new(Environments.Production),
                    var env when env.ToLower() == Environments.QualityAssurance => 
                        new(Environments.QualityAssurance),
                    _ => throw new Exception()
                };
            }
            catch
            {
                PrintLine("Invalid Environment", ConsoleColor.Red);
                Print("Specify the environment: ");
                arguments.Clear();
                arguments.Add(Console.ReadLine() ?? string.Empty);
            }
        }
    }
}