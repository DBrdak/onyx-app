using Amazon.Lambda.APIGatewayEvents;
using Amazon.Lambda.Core;

namespace LambdaKernel.Middlewares;

public interface ILambdaMiddleware
{
    Task<APIGatewayHttpApiV2ProxyResponse> InvokeAsync(APIGatewayHttpApiV2ProxyRequest request, ILambdaContext context, Func<Task<APIGatewayHttpApiV2ProxyResponse>> next);
}