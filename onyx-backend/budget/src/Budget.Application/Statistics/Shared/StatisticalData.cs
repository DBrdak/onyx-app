using Budget.Application.Statistics.Accounts;
using Budget.Application.Statistics.Budget;
using Budget.Application.Statistics.Categories;
using Budget.Application.Statistics.Counterparties;
using Budget.Application.Statistics.Subcategories;
using Budget.Domain.Accounts;
using Budget.Domain.Categories;
using Budget.Domain.Counterparties;
using Budget.Domain.Subcategories;
using Budget.Domain.Transactions;
using Models.Primitives;

namespace Budget.Application.Statistics.Shared;

public sealed record StatisticalData : IStatisticalData
{
    public AccountsData Accounts { get; private set; }
    public BudgetData Budget { get; private set; }
    public CategoriesData Categories { get; private set; }
    public CounterpartiesData Counterparties { get; private set; }
    public SubcategoriesData Subcategories { get; private set; }

    public StatisticalData(
        List<Account> accounts,
        List<Category> categories,
        List<Counterparty> counterparties,
        Domain.Budgets.Budget budget,
        List<Subcategory> subcategories,
        List<Transaction> transactions)
    {
        Accounts = new AccountsData(accounts, transactions, budget);
        Categories = new CategoriesData(categories, subcategories, budget);
        Budget = new BudgetData(transactions, budget);
        Counterparties = new CounterpartiesData(counterparties, transactions, budget);
        Subcategories = new SubcategoriesData(subcategories, budget);
    }

    public void Calculate()
    {
        var calculateAccountsTask = Task.Run(Accounts.Calculate);
        var calculateBudgetTask = Task.Run(Budget.Calculate);
        var calculateCategoriesTask = Task.Run(Categories.Calculate);
        var calculateCounterpartiesTask = Task.Run(Counterparties.Calculate);
        var calculateSubcategoriesTask = Task.Run(Subcategories.Calculate);

        Task.WaitAll(
            calculateAccountsTask,
            calculateBudgetTask,
            calculateCategoriesTask,
            calculateCounterpartiesTask,
            calculateSubcategoriesTask);
    }
}