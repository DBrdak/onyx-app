﻿using Budget.Application.Abstractions.Messaging;
using Budget.Application.Accounts.Models;
using Budget.Application.Contracts.Models;

namespace Budget.Application.Accounts.UpdateAccount;

public sealed record UpdateAccountCommand(
    Guid Id,
    string? NewName,
    MoneyModel? NewBalance,
    Guid BudgetId) : BudgetCommand<AccountModel>(BudgetId);