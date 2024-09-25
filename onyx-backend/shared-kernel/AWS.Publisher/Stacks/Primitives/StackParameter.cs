using Amazon.CloudFormation.Model;

namespace AWS.Publisher.Stacks.Primitives;

internal sealed record StackParameter(string Name)
{
    public string? Value { get; private set; } = null;

    public void SetValue(string value)
    {
        if (string.IsNullOrWhiteSpace(value) || value == "None")
        {
            throw new Exception($"Cannot retrieve value for {Name}");
        }

        Value = value;
    }

    public Parameter ToAmazonParameter() =>
        new()
        {
            ParameterKey = Name,
            ParameterValue = Value ?? throw new ArgumentNullException($"{Name} parameter is undefined")
        };
}