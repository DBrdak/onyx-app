using Budget.Application.Accounts.Models;
using Budget.Application.Categories.Models;
using Budget.Application.Counterparties.Models;

namespace Budget.Application.Budgets.Models;

public sealed record BudgetModel
{
    public Guid Id { get; init; }
    public string Name { get; init; }
    public string Currency { get; init; }
    public IEnumerable<BudgetMemberModel> BudgetMembers { get; init; }
    public IEnumerable<AccountModel>? Accounts { get; init; }
    public IEnumerable<CategoryModel>? Categories { get; init; }
    public IEnumerable<CounterpartyModel>? Counterparties { get; init; }

    private BudgetModel(
        Guid id,
        string name,
        string currency,
        IEnumerable<BudgetMemberModel> budgetMembers,
        IEnumerable<AccountModel>? accounts,
        IEnumerable<CategoryModel>? categories,
        IEnumerable<CounterpartyModel>? counterparties)
    {
        Id = id;
        Name = name;
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
            domainModel.BaseCurrency.Code,
            domainModel.BudgetMembers.Select(BudgetMemberModel.FromDomainModel),
            accountModels,
            categoryModels,
            counterpartyModels);
}