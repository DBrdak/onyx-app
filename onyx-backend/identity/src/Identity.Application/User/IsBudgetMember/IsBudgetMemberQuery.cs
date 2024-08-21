using Abstractions.Messaging;

namespace Identity.Application.User.IsBudgetMember;

public sealed record IsBudgetMemberQuery() : IQuery<bool>;
