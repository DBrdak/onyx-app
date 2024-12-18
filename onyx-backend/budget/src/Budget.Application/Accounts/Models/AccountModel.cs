using Abstractions.Messaging;
using Budget.Application.Contracts.Models;
using Budget.Domain.Accounts;

namespace Budget.Application.Accounts.Models;

public sealed record AccountModel : EntityBusinessModel
{
    public Guid Id { get; init; }
    public string Name { get; init; }
    public string Slug { get; init; }
    public MoneyModel Balance { get; init; }
    public string Type { get; init; }

    [Newtonsoft.Json.JsonConstructor]
    [System.Text.Json.Serialization.JsonConstructor]
    private AccountModel(Guid id, string name, MoneyModel balance, string type, IEnumerable<IDomainEvent> domainEvents)
        : base(domainEvents)
    {
        Id = id;
        Name = name;
        Slug = Name.ToLower().Replace(" ", "-");
        Balance = balance;
        Type = type;
    }

    internal static AccountModel FromDomainModel(Account domainModel) =>
        new(
            domainModel.Id.Value,
            domainModel.Name.Value,
            MoneyModel.FromDomainModel(domainModel.Balance),
            domainModel.Type.Value,
            domainModel.GetDomainEvents());
}