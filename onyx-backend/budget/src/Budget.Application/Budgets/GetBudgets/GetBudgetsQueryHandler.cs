﻿using Abstractions.Messaging;
using Budget.Application.Abstractions.Identity;
using Budget.Application.Budgets.Models;
using Budget.Domain.Budgets;
using Models.Responses;

namespace Budget.Application.Budgets.GetBudgets;

internal sealed class GetBudgetsQueryHandler : IQueryHandler<GetBudgetsQuery, IEnumerable<BudgetModel>>
{
    private readonly IBudgetRepository _budgetRepository;
    private readonly IUserContext _userContext;

    public GetBudgetsQueryHandler(IBudgetRepository budgetRepository, IUserContext userContext)
    {
        _budgetRepository = budgetRepository;
        _userContext = userContext;
    }

    public async Task<Result<IEnumerable<BudgetModel>>> Handle(GetBudgetsQuery request, CancellationToken cancellationToken)
    {
        var userIdGetResult = _userContext.GetUserId();

        if (userIdGetResult.IsFailure)
        {
            return userIdGetResult.Error;
        }

        var userId = userIdGetResult.Value;

        var budgetsGetResult = await _budgetRepository.GetBudgetsForMemberAsync(userId, cancellationToken);

        if (budgetsGetResult.IsFailure)
        {
            return new List<BudgetModel>();
        }

        return BudgetModel.FromDomainModels(budgetsGetResult.Value);
    }
}