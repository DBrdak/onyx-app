using Amazon.Lambda.APIGatewayEvents;
using Amazon.Lambda.Core;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.JsonWebTokens;
using System.Security.Claims;
using Abstractions.Messaging;

namespace LambdaKernel;

public static class RequestAccessorInjector
{
    public static void AddRequestContextAccessor(this IServiceProvider serviceProvider, APIGatewayHttpApiV2ProxyRequest request)
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