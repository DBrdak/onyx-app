using Amazon.Lambda.APIGatewayEvents;
using Amazon.Lambda.Core;
using Models.Responses;

namespace LambdaKernel.Middlewares;

public sealed class ExceptionHandlingMiddleware : ILambdaMiddleware
{
    private ILambdaLogger _logger;

    public async Task<APIGatewayHttpApiV2ProxyResponse> InvokeAsync(APIGatewayHttpApiV2ProxyRequest request, ILambdaContext context, Func<Task<APIGatewayHttpApiV2ProxyResponse>> next)
    {
        try
        {
            _logger = context.Logger;
            return await next();
        }
        catch (Exception exception)
        {
            _logger.LogError($"{typeof(Exception)} occurred: {exception.Message}");

            return Result.Failure(Error.Exception).ReturnAPIResponse(200, 500);
        }
    }
}