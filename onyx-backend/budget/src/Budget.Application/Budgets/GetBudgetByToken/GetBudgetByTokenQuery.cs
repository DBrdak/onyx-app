using Abstractions.Messaging;
using Budget.Application.Budgets.Models;

namespace Budget.Application.Budgets.GetBudgetByToken;

public sealed record GetBudgetByTokenQuery(string Token) : IQuery<BudgetModel>;
