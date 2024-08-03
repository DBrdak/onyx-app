using Abstractions.DomainBaseTypes;

namespace Budget.Domain.Budgets;

public sealed record BudgetMember : ValueObject
{
    public string Id { get; init; }
    public string Username { get; init; }
    public string Email { get; init; }

    private BudgetMember(string id, string username, string email)
    {
        Id = id;
        Username = username;
        Email = email;
    }

    internal static BudgetMember Create(string id, string username, string email) => new(id, username, email);
}