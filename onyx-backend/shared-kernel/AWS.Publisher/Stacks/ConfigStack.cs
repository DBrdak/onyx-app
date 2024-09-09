using AWS.Publisher.Configurations;
using AWS.Publisher.Stacks.Primitives;

namespace AWS.Publisher.Stacks;

internal sealed class ConfigStack : Stack
{
    private const string name = "onyx-config";
    private const string templatePath = @$"{Global.BasePath}\config-template.yaml";
    private const string? packagedTemplatePath = null;
    private static readonly StackParameter[] parameters =
    [
        new("AddBudgetForUserQueueName"),
        new("RemoveUserFromBudgetQueueName"),
        new("RemoveUserQueueName"),
        new("SendEmailTopicName"),
    ];
    private static readonly StackOutput[] outputs =
    [];

    public ConfigStack() : base(
        name,
        templatePath,
        packagedTemplatePath,
        parameters,
        outputs)
    {
    }
}