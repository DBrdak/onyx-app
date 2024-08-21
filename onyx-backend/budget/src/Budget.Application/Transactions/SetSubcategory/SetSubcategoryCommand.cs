using Abstractions.Messaging;
using Budget.Application.Transactions.Models;

namespace Budget.Application.Transactions.SetSubcategory;

public sealed record SetSubcategoryCommand(Guid TransactionId, Guid SubcategoryId) : ICommand;
