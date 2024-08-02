using Abstractions.Messaging;

namespace Budget.Domain.Budgets.DomainEvents;

public sealed record BudgetCreatedDomainEvent(Budget Budget) : IDomainEvent;