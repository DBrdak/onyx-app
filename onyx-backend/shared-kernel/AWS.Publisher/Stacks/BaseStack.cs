using Amazon.CloudFormation.Model;
using AWS.Publisher.Configurations;
using AWS.Publisher.Stacks.Primitives;

namespace AWS.Publisher.Stacks;

internal sealed class BaseStack : Stack
{
    private const string name = "onyx-base";
    private const string templatePath = @$"{Global.BasePath}\base-template.yaml";
    private const string? packagedTemplatePath = null;
    private static readonly StackParameter[] parameters = [];
    private static readonly StackOutput[] outputs =
    [
        new("FullAccessRoleArn"),
        new("S3BucketName")
    ];

    public BaseStack(CurrentEnvironment env) : base(
        name,
        templatePath,
        packagedTemplatePath,
        parameters,
        outputs,
        env)
    { }
}