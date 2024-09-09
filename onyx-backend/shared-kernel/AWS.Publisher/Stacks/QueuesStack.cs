using AWS.Publisher.Configurations;
using AWS.Publisher.Stacks.Primitives;

namespace AWS.Publisher.Stacks;

internal sealed class QueuesStack : Stack
{
    private const string name = "onyx-queues";
    private const string templatePath = @$"{Global.BasePath}\queues-template.yaml";
    private const string? packagedTemplatePath = null;
    private static readonly StackParameter[] parameters = [];
    private static readonly StackOutput[] outputs =
    [
        new("DeadLetterQueueArn"),
        new("RemoveUserFromBudgetQueueName"),
        new("AddBudgetForUserQueueName"),
        new("RemoveUserQueueName"),
        new("AddBudgetForUserQueueArn"),
        new("RemoveUserFromBudgetQueueArn"),
        new("RemoveUserQueueArn"),
    ];

    public QueuesStack() : base(
        name,
        templatePath,
        packagedTemplatePath,
        parameters,
        outputs)
    {
    }
}