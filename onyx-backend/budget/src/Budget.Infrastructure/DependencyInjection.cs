using Budget.Application.Abstractions.Currency;
using Budget.Application.Abstractions.Identity;
using Budget.Application.Abstractions.IntegrationEvents;
using Budget.Domain.Accounts;
using Budget.Domain.Budgets;
using Budget.Domain.Categories;
using Budget.Domain.Counterparties;
using Budget.Domain.Subcategories;
using Budget.Domain.Transactions;
using Budget.Infrastructure.Contexts;
using Budget.Infrastructure.CurrencyServices;
using Budget.Infrastructure.CurrencyServices.NbpClient;
using Budget.Infrastructure.Data.Services;
using Budget.Infrastructure.Queues;
using Budget.Infrastructure.Repositories;
using Microsoft.Extensions.DependencyInjection;
using SharedDAL;
using SharedDAL.DataModels.Abstractions;

namespace Budget.Infrastructure;

public static class DependencyInjection
{
    private const string currencyConverterUrl = "http://api.nbp.pl/api/exchangerates/rates/A/";

    public static void InjectInfrastructure(this IServiceCollection services)
    {
        services.AddPersistence();
        services.AddCurrencyConverter();
        services.AddContexts();
        services.AddIntegrationEvents();
    }

    private static void AddPersistence(this IServiceCollection services)
    {
        services.AddScoped<DbContext>();
        services.AddScoped(typeof(IDataModelService<>), typeof(DataModelService<>));
        services.AddScoped<ITransactionRepository, TransactionRepository>();
        services.AddScoped<IAccountRepository, AccountRepository>();
        services.AddScoped<ISubcategoryRepository, SubcategoryRepository>();
        services.AddScoped<ICounterpartyRepository, CounterpartyRepository>();
        services.AddScoped<ICategoryRepository, CategoryRepository>();
        services.AddScoped<IBudgetRepository, BudgetRepository>();
    }

    private static void AddCurrencyConverter(this IServiceCollection services)
    {
        services.AddHttpClient<NbpClient>(client =>
        {
            client.BaseAddress = new Uri(currencyConverterUrl);
        });

        services.AddTransient<ICurrencyConverter, CurrencyConverter>();
    }

    private static void AddContexts(this IServiceCollection services)
    {
        services.AddScoped<IBudgetContext, BudgetContext>();
        services.AddScoped<IUserContext, UserContext>();
    }
    private static void AddIntegrationEvents(this IServiceCollection services)
    {
        services.AddScoped<IQueueMessagePublisher, QueueMessagePublisher>();
    }
}