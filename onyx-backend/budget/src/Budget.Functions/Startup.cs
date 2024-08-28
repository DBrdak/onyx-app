using Budget.Application;
using Budget.Functions.Middlewares;
using Budget.Infrastructure;
using LambdaKernel;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

#pragma warning disable CS1591

namespace Budget.Functions;

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
            .AddSystemsManager("/onyx-budget")
            .Build();

        services.AddSingleton<IConfiguration>(configuration);

        return configuration;
    }
}
