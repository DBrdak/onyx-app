using AWS.Publisher.Configurations;
using AWS.Publisher.Stacks.Primitives;

namespace AWS.Publisher.Stacks;

internal sealed class MessangerStack : Stack
{
    private const string name = "onyx-messanger";
    private const string templatePath = @$"{Global.BasePath}\messanger\src\Messanger.Lambda\messanger-template.yaml";
    private const string packagedTemplatePath = $@"{Global.BasePath}\messanger\src\Messanger.Lambda\packaged-messanger.yaml";
    private static readonly StackParameter[] parameters =
    [
        new("FullAccessRoleArn")
    ];
    private static readonly StackOutput[] outputs =
    [
        new("SendEmailTopicName")
    ];

    public MessangerStack() : base(
        name,
        templatePath,
        packagedTemplatePath,
        parameters,
        outputs)
    {
    }
}