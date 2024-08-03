using Budget.Application.Accounts.Models;
using Budget.Application.Categories.Models;
using Budget.Application.Counterparties.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Budget.Application.Budgets.Models;

public sealed record BudgetMemberModel
{
    public string Id { get; init; }
    public string Username { get; init; }
    public string Email { get; init; }

    private BudgetMemberModel(string id, string username, string email)
    {
        Id = id;
        Username = username;
        Email = email;
    }

    internal static BudgetMemberModel FromDomainModel(
        Domain.Budgets.BudgetMember domainModel) =>
        new(domainModel.Id, domainModel.Username, domainModel.Email);
}