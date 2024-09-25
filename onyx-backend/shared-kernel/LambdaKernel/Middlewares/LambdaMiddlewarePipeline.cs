using Amazon.Lambda.APIGatewayEvents;
using Amazon.Lambda.Core;

namespace LambdaKernel.Middlewares;

public class LambdaMiddlewarePipeline
{
    private readonly List<ILambdaMiddleware> _middlewares;

    public LambdaMiddlewarePipeline(IEnumerable<ILambdaMiddleware> middlewares)
    {
            _middlewares = middlewares.ToList();
        }

    public Task<APIGatewayHttpApiV2ProxyResponse> ExecuteAsync(APIGatewayHttpApiV2ProxyRequest request, ILambdaContext context, Func<Task<APIGatewayHttpApiV2ProxyResponse>> endpoint)
    {
            var pipeline = endpoint;

            foreach (var middleware in _middlewares.Reverse<ILambdaMiddleware>())
            {
                var next = pipeline;
                pipeline = () => middleware.InvokeAsync(request, context, next);
            }

            return pipeline();
        }
}