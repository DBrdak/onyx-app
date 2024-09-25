using AWS.Publisher.Configurations;
using AWS.Publisher.Stacks;

namespace AWS.Publisher;

internal class AppBuilder
{
    private readonly CloudFormation.Publisher _publisher;
    private readonly CurrentEnvironment _env;

    public AppBuilder(CloudFormation.Publisher publisher, CurrentEnvironment env)
    {
        _publisher = publisher;
        _env = env;
    }

    public async Task BuildAwsApplication()
    {
        var stacks = StacksFactory.GetStacksForDeployment(_env);

        foreach (var stack in stacks)
        {
            await _publisher.DeployStackAsync(stack);
        }
    }
}