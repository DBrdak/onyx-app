using System.Reflection;
using Amazon.DynamoDBv2.DocumentModel;
using Budget.Domain.Budgets;
using SharedDAL.DataModels;
using SharedDAL.DataModels.Abstractions;

namespace Budget.Infrastructure.Data.DataModels.Budgets;

internal sealed class BudgetMemberDataModel : IDataModel<BudgetMember>
{
    public string Id { get; init; }
    public string Username { get; init; }
    public string Email { get; init; }

    private BudgetMemberDataModel(BudgetMember budgetMember)
    {
        Id = budgetMember.Id;
        Username = budgetMember.Username;
        Email = budgetMember.Email;
    }

    private BudgetMemberDataModel(Document doc)
    {
        Id = doc[nameof(Id)].AsString();
        Username = doc[nameof(Username)].AsString();
        Email = doc[nameof(Email)].AsString();
    }

    public static BudgetMemberDataModel FromDomainModel(BudgetMember budgetMember) => new(budgetMember);
    public static BudgetMemberDataModel FromDocument(Document doc) => new(doc);

    public Type GetDomainModelType() => typeof(BudgetMember);

    public BudgetMember ToDomainModel() =>
        Activator.CreateInstance(
            typeof(BudgetMember),
            BindingFlags.Instance | BindingFlags.NonPublic, 
            null,
            [Id, Username, Email],
            null) as BudgetMember ??
        throw new DataModelConversionException(
            typeof(BudgetMemberDataModel),
            typeof(BudgetMember));
}