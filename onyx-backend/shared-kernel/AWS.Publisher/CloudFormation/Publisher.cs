using Amazon.CloudFormation;
using Amazon.CloudFormation.Model;
using System.Diagnostics;
using static AWS.Publisher.Terminal.Printer;

namespace AWS.Publisher.CloudFormation;

internal sealed class Publisher
{
    private readonly AmazonCloudFormationClient _cloudFormationClient;

    public Publisher(AmazonCloudFormationClient cloudFormationClient)
    {
        _cloudFormationClient = cloudFormationClient;
    }

    public async Task<Stacks.Stack> DeployStackAsync(Stacks.Stack stack)
    {
        var deployRequest = new CreateStackRequest
        {
            StackName = stack.Name,
            TemplateBody = await File.ReadAllTextAsync(stack.TemplatePath),
            Parameters = [.. stack.Parameters.Select(p => p.ToAmazonParameter())],
            Capabilities = ["CAPABILITY_NAMED_IAM"]
        };

        try
        {
            await _cloudFormationClient.CreateStackAsync(deployRequest);
            PrintLine($"Successfully deployed {stack.Name}", ConsoleColor.Green);
            stack = await SetStackOutput(stack);
        }
        catch (Exception ex)
        {
            PrintLine($"Error deploying {stack.Name}: {ex.Message}", ConsoleColor.Red);
        }

        return stack;
    }

    private async Task<Stacks.Stack> SetStackOutput(Stacks.Stack stack)
    {
        var describeStacksResponse = await _cloudFormationClient.DescribeStacksAsync(new DescribeStacksRequest
        {
            StackName = stack.Name
        });

        var awsStack = describeStacksResponse.Stacks.FirstOrDefault();

        foreach (var emptyOutput in stack.Outputs)
        {
            var output = awsStack.Outputs.FirstOrDefault(
                output => output.OutputKey.ToLower() == emptyOutput.Name.ToLower());

            if (output is null)
            {
                continue;
            }

            emptyOutput.SetValue(output.OutputValue);
        }
        
        return stack;
    }
}