using Abstractions.Messaging;
using Budget.Application.Contracts.Models;

namespace Budget.Application.Subcategories.GetToAssign;

public sealed record GetToAssignQuery(int Month, int Year) : IQuery<MoneyModel>;