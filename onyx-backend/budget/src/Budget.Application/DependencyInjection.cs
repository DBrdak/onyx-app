﻿using Budget.Application.Behaviors;
using Budget.Application.Subcategories.Validator;
using Microsoft.Extensions.DependencyInjection;

namespace Budget.Application;

public static class DependencyInjection
{
    public static void InjectApplication(this IServiceCollection services)
    {
        services.AddMediatR(
            config =>
            {
                config.RegisterServicesFromAssemblyContaining<ApplicationAssemblyReference>();
                config.AddOpenBehavior(typeof(LoggingBehavior<,>));
            });

        services.AddTransient<SubcategoryGlobalValidator>();
    }
}