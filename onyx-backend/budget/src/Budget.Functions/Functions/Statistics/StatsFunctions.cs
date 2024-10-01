using Amazon.Lambda.Annotations;
using Amazon.Lambda.Annotations.APIGateway;
using Amazon.Lambda.APIGatewayEvents;
using Budget.Application.Statistics.Categories.GetCategoryStats;
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

    [LambdaFunction(ResourceName = $"Stats{nameof(GetCategoriesStats)}")]
    [HttpApi(LambdaHttpMethod.Get, $"{statsBaseRoute}/categories")]
    public async Task<APIGatewayHttpApiV2ProxyResponse> GetCategoriesStats(
        string budgetId,
        [FromQuery]int fromYear,
        [FromQuery] int fromMonth,
        [FromQuery] int toYear,
        [FromQuery] int toMonth,
        APIGatewayHttpApiV2ProxyRequest requestContext)
    {
        ServiceProvider?.AddRequestContextAccessor(requestContext);

        var query = new GetCategoryStatsQuery(fromMonth, fromYear, toMonth, toYear);

        var result = await Sender.Send(query);

        return result.ReturnAPIResponse(200, 400);
    }
}