using Budget.Application.Accounts.Models;
using Budget.Application.Categories.Models;
using Budget.Application.Counterparties.Models;

namespace Budget.Application.Budgets.Models;

public sealed record BudgetModel
{
    public Guid Id { get; init; }
    public string Name { get; init; }
    public string Slug { get; init; }
    public string Currency { get; init; }
    public IEnumerable<BudgetMemberModel> BudgetMembers { get; init; }
    public IEnumerable<AccountModel>? Accounts { get; init; }
    public IEnumerable<CategoryModel>? Categories { get; init; }
    public IEnumerable<CounterpartyModel>? Counterparties { get; init; }

    private BudgetModel(
        Guid id,
        string name,
        string slug,
        string currency,
        IEnumerable<BudgetMemberModel> budgetMembers,
        IEnumerable<AccountModel>? accounts,
        IEnumerable<CategoryModel>? categories,
        IEnumerable<CounterpartyModel>? counterparties)
    {
        Id = id;
        Name = name;
        Slug = slug;
        Currency = currency;
        BudgetMembers = budgetMembers;
        Accounts = accounts;
        Categories = categories;
        Counterparties = counterparties;
    }

    internal static BudgetModel FromDomainModel(
        Domain.Budgets.Budget domainModel,
        IEnumerable<CategoryModel>? categoryModels = null,
        IEnumerable<AccountModel>? accountModels = null,
        IEnumerable<CounterpartyModel>? counterpartyModels = null) =>
        new(
            domainModel.Id.Value,
            domainModel.Name.Value,
            domainModel.Name.Value.ToLower().Replace(" ", "-"),
            domainModel.BaseCurrency.Code,
            domainModel.BudgetMembers.Select(BudgetMemberModel.FromDomainModel),
            accountModels,
            categoryModels,
            counterpartyModels);

    private static BudgetModel FromDomainModelWithSlug(
        Domain.Budgets.Budget domainModel,
        int slugSuffix,
        IEnumerable<CategoryModel>? categoryModels = null,
        IEnumerable<AccountModel>? accountModels = null,
        IEnumerable<CounterpartyModel>? counterpartyModels = null) =>
        new(
            domainModel.Id.Value,
            domainModel.Name.Value,
            string.Concat(domainModel.Name.Value.ToLower().Replace(" ", "-"), slugSuffix),
            domainModel.BaseCurrency.Code,
            domainModel.BudgetMembers.Select(BudgetMemberModel.FromDomainModel),
            accountModels,
            categoryModels,
            counterpartyModels);

    internal static List<BudgetModel> FromDomainModels(
        IEnumerable<Domain.Budgets.Budget> domainModels)
    {
        var domainBudgets = domainModels.ToList();
        var budgetModels = new List<BudgetModel>();
        var slugSuffix = 1;

        foreach (var domainBudget in domainBudgets)
        {
            if (budgetModels.Any(bm => bm.Name.ToLower() == domainBudget.Name.Value.ToLower()))
            {
                budgetModels.Add(FromDomainModelWithSlug(domainBudget, slugSuffix));
                slugSuffix++;
                continue;
            }

            budgetModels.Add(FromDomainModel(domainBudget));
        }

        return budgetModels;
    }
}