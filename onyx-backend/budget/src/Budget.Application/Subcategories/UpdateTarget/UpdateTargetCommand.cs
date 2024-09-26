using Budget.Application.Abstractions.Messaging;
using Budget.Application.Subcategories.Models;
using Models.Primitives;

namespace Budget.Application.Subcategories.UpdateTarget;

public sealed record UpdateTargetCommand(
    Guid SubcategoryId,
    MonthDate StartedAt,
    MonthDate TargetUpToMonth,
    decimal TargetAmount,
    Guid BudgetId) : BudgetCommand<SubcategoryModel>(BudgetId);