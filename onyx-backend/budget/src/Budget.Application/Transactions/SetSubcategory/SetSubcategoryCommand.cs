using Abstractions.Messaging;

namespace Budget.Application.Transactions.SetSubcategory;

public sealed record SetSubcategoryCommand(Guid TransactionId, Guid SubcategoryId) : ICommand;
