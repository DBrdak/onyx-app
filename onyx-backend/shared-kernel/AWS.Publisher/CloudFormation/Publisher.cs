using Amazon.CloudFormation;
using Amazon.CloudFormation.Model;
using AWS.Publisher.Shell;
using AWS.Publisher.Stacks;
using AWS.Publisher.Stacks.Extensions;
using static AWS.Publisher.Terminal.Printer;
using Delegate = AWS.Publisher.Extensions.Delegate;
using Stack = AWS.Publisher.Stacks.Stack;

namespace AWS.Publisher.CloudFormation;

internal sealed class Publisher
{
    private readonly AmazonCloudFormationClient _cloudFormationClient;
    private readonly StackRegistry _stackRegistry;

    public Publisher(
        AmazonCloudFormationClient cloudFormationClient,
        StackRegistry stackRegistry)
    {
        _cloudFormationClient = cloudFormationClient;
        _stackRegistry = stackRegistry;
    }

    public async Task<Stack> DeployStackAsync(Stack stack)
    {
        stack = SetStackParamsAsync(stack);

        stack = PackageStack(stack);


        try
        {
            stack = await CreateStackAsync(stack);
        }
        catch (AlreadyExistsException)
        {

            await Delegate.TryCatchAsync(
                async () =>
                {
                    stack = await UpdateStackAsync(stack);
                },
                ex => $"Error occured on deploying {stack.Name}: {ex.Message}");
        }
        catch (Exception ex)
        {
            PrintLine($"Error occured on deploying {stack.Name}: {ex.Message}", ConsoleColor.Red);
            Environment.Exit(1);
        }

        _stackRegistry.AddDeployedStack(stack);

        return stack;
    }

    private async Task<Stack> UpdateStackAsync(Stack stack)
    {
        var updateRequest = new UpdateStackRequest
        {
            StackName = stack.Name,
            TemplateBody = await stack.GetTemplateFileAsync(),
            Parameters = [.. stack.Parameters.Select(p => p.ToAmazonParameter())],
            Capabilities = ["CAPABILITY_AUTO_EXPAND"]
        };

        PrintLine($"{stack.Name} already exists, update in progress...", ConsoleColor.Blue);
        await _cloudFormationClient.UpdateStackAsync(updateRequest);
        PrintLine($"Successfully updated {stack.Name}", ConsoleColor.Green);
        stack = await SetStackOutputAsync(stack);

        return stack;
    }

    private async Task<Stack> CreateStackAsync(Stack stack)
    {
        var createRequest = new CreateStackRequest
        {
            StackName = stack.Name,
            TemplateBody = await stack.GetTemplateFileAsync(),
            Parameters = [.. stack.Parameters.Select(p => p.ToAmazonParameter())],
            Capabilities = ["CAPABILITY_AUTO_EXPAND"]
        };

        PrintLine($"Creating new {stack.Name} stack...", ConsoleColor.Blue);
        await _cloudFormationClient.CreateStackAsync(createRequest);
        PrintLine($"Successfully deployed {stack.Name}", ConsoleColor.Green);
        stack = await SetStackOutputAsync(stack);

        return stack;
    }

    private Stack PackageStack(Stack stack)
    {
        if (string.IsNullOrWhiteSpace(stack.PackagedTemplatePath))
        {
            return stack;
        }

        PrintLine($"Packaging template for {stack.Name} stack...", ConsoleColor.Blue);

        SamCommands.BuildTemplate(stack.TemplatePath)
            .ExecuteShellCommand();

        SamCommands.PackageTemplate(stack.PackagedTemplatePath)
            .ExecuteShellCommand();

        PrintLine($"{stack.Name} stack packaged", ConsoleColor.Blue);

        return stack;
    }

    private Stack SetStackParamsAsync(Stack stack)
    {
        if (stack.Parameters.Length < 1)
        {
            return stack;
        }

        foreach (var stackParameter in stack.Parameters)
        {
            if (!string.IsNullOrWhiteSpace(stackParameter.Value))
            {
                continue;
            }

            Delegate.TryCatch(
                () =>
                {
                    var output = _stackRegistry.GetOutput(stackParameter.Name);
                    stackParameter.SetValue(output.Value);
                },
                $"Error occured when trying to set parameter {stackParameter.Name} for stack {stack.Name}");
        }

        return stack;
    }

    private async Task<Stack> SetStackOutputAsync(Stack stack)
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