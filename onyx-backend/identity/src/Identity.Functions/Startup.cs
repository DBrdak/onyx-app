using Amazon.DynamoDBv2.Model;
using Identity.Application;
using Identity.Functions.Middlewares;
using Identity.Infrastructure;
using LambdaKernel;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SharedDAL.S3;

namespace Identity.Functions;

[Amazon.Lambda.Annotations.LambdaStartup]
public class Startup
{
    public void ConfigureServices(IServiceCollection services)
    { 
        UseConfiguration(services);
        services.InjectApplication();
        services.InjectInfrastructure();
        services.InitRequestContextAccessor();
    }

    public void Configure(IApplicationBuilder app)
    {
        app.UseMiddleware<ExceptionMiddleware>();

        app.Build();
    }

    private static IConfiguration UseConfiguration(IServiceCollection services)
    {
        var configuration = new ConfigurationBuilder()
            .AddSystemsManager("/onyx-identity")
            .Build();

        services.AddSingleton<IConfiguration>(configuration);

        return configuration;
    }
}