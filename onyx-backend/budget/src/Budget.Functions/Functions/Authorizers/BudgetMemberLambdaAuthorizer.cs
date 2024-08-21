
using Amazon.Lambda.Annotations;
using Amazon.Lambda.APIGatewayEvents;
using Amazon.Lambda.Core;
using Budget.Application.Budgets.IsBudgetMember;
using Budget.Functions.Functions.Shared;
using LambdaKernel;
using MediatR;
using Newtonsoft.Json;

namespace Budget.Functions.Functions.Authorizers;

public class BudgetMemberLambdaAuthorizer : BaseFunction
{
    public BudgetMemberLambdaAuthorizer(
        ISender sender,
        IServiceProvider serviceProvider) : base(
        sender,
        serviceProvider)
    {
    }

    [LambdaFunction(ResourceName = "BudgetMemberLambdaAuthorizer")]
    public async Task<APIGatewayCustomAuthorizerV2SimpleResponse> FunctionHandler(
        APIGatewayCustomAuthorizerV2Request request,
        ILambdaContext context)
    {
        ServiceProvider?.AddRequestContextAccessor(request);

        var query = new IsBudgetMemberQuery();

        var result = await Sender.Send(query);
        context.Logger.Log(JsonConvert.SerializeObject(result));

        return new APIGatewayCustomAuthorizerV2SimpleResponse
        {
            IsAuthorized = result.IsSuccess && result.Value
        };
    }
}
