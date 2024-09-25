using AWS.Publisher.Stacks.Primitives;

namespace AWS.Publisher.Stacks;

internal sealed class StackRegistry
{
    private readonly List<Stack> _stacks = [];

    public StackOutput GetOutput(string outputName) =>
        _stacks.SelectMany(s => s.Outputs).FirstOrDefault(o => o.Name.ToLower() == outputName.ToLower()) ??
        throw new KeyNotFoundException();

    public void AddDeployedStack(Stack stack) => _stacks.Add(stack);
}