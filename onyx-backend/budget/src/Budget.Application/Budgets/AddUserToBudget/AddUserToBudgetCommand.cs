using Abstractions.Messaging;
using Budget.Application.Budgets.Models;

namespace Budget.Application.Budgets.AddUserToBudget;

public sealed record AddUserToBudgetCommand(string Token) : ICommand<BudgetModel>;