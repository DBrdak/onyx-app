using Amazon.Lambda.Annotations;
using Amazon.Lambda.Annotations.APIGateway;
using Amazon.Lambda.APIGatewayEvents;
using Budget.Application.Statistics;
using Budget.Functions.Functions.Shared;
using LambdaKernel;
using MediatR;

namespace Budget.Functions.Functions.Statistics;

internal class StatsFunctions : BaseFunction
{
    private const string statsBaseRoute = $"{BaseRouteV1}/{{budgetId}}/stats";

    public StatsFunctions(ISender sender, IServiceProvider serviceProvider) : base(sender, serviceProvider)
    {
    }

    [LambdaFunction(ResourceName = $"{nameof(GetStatisticalData)}")]
    [HttpApi(LambdaHttpMethod.Get, $"{statsBaseRoute}")]
    public async Task<APIGatewayHttpApiV2ProxyResponse> GetStatisticalData(
        string budgetId,
        APIGatewayHttpApiV2ProxyRequest requestContext)
    {
        ServiceProvider?.AddRequestContextAccessor(requestContext);

        var query = new GetStatisticalDataQuery();

        var result = await Sender.Send(query);

        return result.ReturnAPIResponse(200, 404);
    }
}