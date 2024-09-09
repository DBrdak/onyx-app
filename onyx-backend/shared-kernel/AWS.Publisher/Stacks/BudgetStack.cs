using AWS.Publisher.Configurations;
using AWS.Publisher.Stacks.Primitives;

namespace AWS.Publisher.Stacks;

internal sealed class BudgetStack : Stack
{
    private const string name = "onyx-budget";
    private const string templatePath = @$"{Global.BasePath}\budget\src\Budget.Functions\budget-template.yaml";
    private const string packagedTemplatePath = $@"{Global.BasePath}\budget\src\Budget.Functions\packaged-budget.yaml";
    private static readonly StackParameter[] parameters = 
    [
        new ("LambdaAuthorizerArn"),
        new ("FullAccessRoleArn"),
        new ("RemoveUserQueueArn"),
        new ("Environment"),
    ];
    private static readonly StackOutput[] outputs = 
    [
        new("ApiURL")
    ];

    public BudgetStack(CurrentEnvironment env) : base(
        name,
        templatePath,
        packagedTemplatePath,
        parameters,
        outputs,
        env)
    {
    }
}