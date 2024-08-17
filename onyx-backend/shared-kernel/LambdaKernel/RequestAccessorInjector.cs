using Amazon.Lambda.APIGatewayEvents;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.JsonWebTokens;
using Abstractions.Messaging;
using Amazon.Lambda.Core;

namespace LambdaKernel;

public static class RequestAccessorInjector
{
    public static void AddRequestContextAccessor(
        this IServiceProvider serviceProvider,
        APIGatewayHttpApiV2ProxyRequest request,
        ILambdaContext? lambdaContext = null)
    {
        var requestAccessor = serviceProvider.GetRequiredService<RequestAccessor>();

        var authorizationToken = request.Headers.FirstOrDefault(kvp => kvp.Key.ToLower() == "authorization").Value?
            .Replace("Bearer ", string.Empty);
        var claims = authorizationToken is null ? [] : new JsonWebToken(authorizationToken).Claims;

        var path = request.RawPath;
        var method = request.RequestContext.Http.Method;

        requestAccessor.SetUp(authorizationToken, claims, path, method);
    }

    public static IServiceCollection InitRequestContextAccessor(this IServiceCollection services)
    {
        services.AddSingleton(new RequestAccessor());

        return services;
    }
}