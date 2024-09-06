using System.IO.Pipes;
using AWS.Publisher.Configurations;
using AWS.Publisher.Stacks.Primitives;

namespace AWS.Publisher.Stacks;

internal sealed class IdentityStack : Stack
{
    private const string name = "onyx-identity";
    private const string templatePath = @$"{Global.BasePath}\identity\src\Identity.Functions\identity-template.yaml";
    private const string packagedTemplatePath = $@"{Global.BasePath}\identity\src\Identity.Functions\packaged-identity.yaml";
    private static readonly StackParameter[] parameters =
    [
        new("FullAccessRoleArn"),
        new("AddBudgetForUserQueueArn"),
        new("RemoveUserFromBudgetQueueArn"),
        new("Environment")
    ];
    private static readonly StackOutput[] outputs =
    [
        new("ApiURL"),
        new("LambdaAuthorizerArn")
    ];

    public IdentityStack(CurrentEnvironment env) : base(
        name,
        templatePath,
        packagedTemplatePath,
        parameters,
        outputs,
        env)
    {
    }
}