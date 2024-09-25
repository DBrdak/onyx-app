namespace AWS.Publisher.Stacks.Primitives;

internal sealed record StackOutput(string Name)
{
    public string Value { get; private set; } = string.Empty;

    public void SetValue(string value) => Value = value;
}