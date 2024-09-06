using AWS.Publisher.Configurations;
using AWS.Publisher.Stacks.Primitives;

namespace AWS.Publisher.Stacks;

internal abstract class Stack
{
    public string Name { get; init; }
    public string TemplatePath { get; init; }
    public string? PackagedTemplatePath { get; init; }
    public StackParameter[] Parameters { get; init; }
    public StackOutput[] Outputs { get; init; }

    protected Stack(
        string name,
        string templatePath,
        string? packagedTemplatePath,
        StackParameter[] parameters,
        StackOutput[] outputs,
        CurrentEnvironment env)
    {
        Name = $"{Name}-{env.Value}";
        TemplatePath = templatePath;
        PackagedTemplatePath = packagedTemplatePath;
        Parameters = parameters;
        Outputs = outputs;
    }
}