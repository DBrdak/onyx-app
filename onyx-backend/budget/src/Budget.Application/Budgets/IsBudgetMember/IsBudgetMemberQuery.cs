using Abstractions.Messaging;

namespace Budget.Application.Budgets.IsBudgetMember;

public sealed record IsBudgetMemberQuery() : IQuery<bool>;
