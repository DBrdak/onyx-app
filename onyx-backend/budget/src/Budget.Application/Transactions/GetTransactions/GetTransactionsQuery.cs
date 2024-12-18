﻿using Abstractions.Messaging;
using Budget.Application.Transactions.Models;

namespace Budget.Application.Transactions.GetTransactions;

public sealed record GetTransactionsQuery(
    Guid? CounterpartyId,
    Guid? AccountId,
    Guid? SubcategoryId,
    string? DateRangeStart,
    string? DateRangeEnd) : IQuery<IEnumerable<TransactionModel>>;