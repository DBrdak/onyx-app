using Abstractions.Messaging;
using Budget.Application.Budgets.Models;

namespace Budget.Application.Budgets.EditBudget;

public sealed record EditBudgetCommand(string NewBudgetName) : ICommand<BudgetModel>;
