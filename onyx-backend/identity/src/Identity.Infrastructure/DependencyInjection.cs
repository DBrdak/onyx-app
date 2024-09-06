using Identity.Application.Abstractions.Authentication;
using Identity.Application.Abstractions.IntegrationEvents;
using Identity.Domain;
using Identity.Infrastructure.Authentication;
using Identity.Infrastructure.Data.Services;
using Identity.Infrastructure.Email;
using Identity.Infrastructure.Messanger;
using Identity.Infrastructure.Queues;
using Identity.Infrastructure.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.DependencyInjection;
using SharedDAL;
using SharedDAL.DataModels.Abstractions;

namespace Identity.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection InjectInfrastructure(this IServiceCollection services) =>
        services.AddPersistence()
            .AddAuthentication()
            .AddContexts()
            .AddMessanger()
            .AddEventServices();

    private static IServiceCollection AddPersistence(this IServiceCollection services) =>
        services.AddScoped<DbContext>()
            .AddScoped(typeof(IDataModelService<>), typeof(DataModelService<>))
            .AddScoped<IUserRepository, UserRepository>();

    private static IServiceCollection AddMessanger(this IServiceCollection services) =>
        services
            .AddSingleton<MessangerClient>()
            .AddScoped<IEmailService, EmailService>();

    private static IServiceCollection AddContexts(
        this IServiceCollection services) =>
        services.AddScoped<IUserContext, UserContext>();

    private static IServiceCollection AddAuthentication(this IServiceCollection services) =>
        services
            .ConfigureOptions<AuthenticationOptionsSetup>()
            .ConfigureOptions<JwtBearerOptionsSetup>()
            .AddScoped<IJwtService, JwtService>()
            .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer()
            .Services;

    private static IServiceCollection AddEventServices(this IServiceCollection services) =>
        services.AddScoped<IQueueMessagePublisher, QueueMessagePublisher>();
}