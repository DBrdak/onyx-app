using Amazon.Lambda.APIGatewayEvents;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.JsonWebTokens;
using Abstractions.Messaging;
using Amazon.Lambda.Core;

namespace LambdaKernel;

public static class RequestAccessorInjector
{
    private static void AddRequestContextAccessor(
        IServiceProvider serviceProvider,
        IDictionary<string, string> headers,
        string rawPath,
        IDictionary<string, string>? pathParams,
        string method,
        ILambdaContext? lambdaContext = null)
    {
        var requestAccessor = serviceProvider.GetRequiredService<RequestAccessor>();

        var authorizationToken = headers.FirstOrDefault(kvp => kvp.Key.ToLower() == "authorization").Value?
            .Replace("Bearer ", string.Empty);
        var claims = authorizationToken is null ? [] : new JsonWebToken(authorizationToken).Claims;

        var path = rawPath;

        requestAccessor.SetUp(authorizationToken, claims, pathParams?.ToDictionary() ?? [], path, method);
    }

    public static void AddRequestContextAccessor(
        this IServiceProvider serviceProvider,
        APIGatewayHttpApiV2ProxyRequest request,
        ILambdaContext? lambdaContext = null) =>
        AddRequestContextAccessor(
            serviceProvider,
            request.Headers,
            request.RawPath,
            request.PathParameters,
            request.RequestContext.Http.Method);

    public static void AddRequestContextAccessor(
        this IServiceProvider serviceProvider,
        APIGatewayCustomAuthorizerV2Request request,
        ILambdaContext? lambdaContext = null) =>
        AddRequestContextAccessor(
            serviceProvider,
            request.Headers,
            request.RawPath,
            request.PathParameters,
            request.RequestContext.Http.Method);

    public static IServiceCollection InitRequestContextAccessor(this IServiceCollection services)
    {
        services.AddSingleton(new RequestAccessor());
        
        return services;
    }
}