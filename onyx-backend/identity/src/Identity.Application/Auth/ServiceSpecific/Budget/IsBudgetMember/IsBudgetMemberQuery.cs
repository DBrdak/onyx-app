using Abstractions.Messaging;

namespace Identity.Application.Auth.ServiceSpecific.Budget.IsBudgetMember;

public sealed record IsBudgetMemberQuery(string Token, string BudgetId) : IQuery<bool>;
