using AWS.Publisher.Configurations;

namespace AWS.Publisher.Stacks;

internal sealed class StacksFactory
{
    public static Stack[] GetStacksForDeployment(CurrentEnvironment env) =>
    [
        new BaseStack(env),
        new QueuesStack(env),
        new MessangerStack(env),
        new IdentityStack(env),
        new BudgetStack(env),
        new ConfigStack(env)
    ];
}