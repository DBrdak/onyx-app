using AWS.Publisher.Configurations;

namespace AWS.Publisher.Stacks;

internal sealed class StacksFactory
{
    public static Stack[] GetStacksForDeployment(CurrentEnvironment env) =>
    [
        new BaseStack(),
        new QueuesStack(),
        new MessangerStack(),
        new IdentityStack(env),
        new BudgetStack(env),
        new ConfigStack()
    ];
}