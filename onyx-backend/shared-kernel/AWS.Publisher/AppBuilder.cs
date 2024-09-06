using Amazon.CloudFormation;
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

    public async Task BuildAWSApplication()
    {
        var stacks = StacksFactory.GetStacksForDeployment(_env);

        var deploymentTasks = stacks.Select(async stack => await _publisher.DeployStackAsync(stack));

        await Task.WhenAll(deploymentTasks);
    }
}