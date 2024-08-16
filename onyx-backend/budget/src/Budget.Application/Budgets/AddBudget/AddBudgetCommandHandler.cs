﻿using Abstractions.Messaging;
using Budget.Application.Abstractions.Identity;
using Budget.Application.Budgets.Models;
using Budget.Domain.Budgets;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using Models.Responses;
using Newtonsoft.Json;

namespace Budget.Application.Budgets.AddBudget;

internal sealed class AddBudgetCommandHandler : ICommandHandler<AddBudgetCommand, BudgetModel>
{
    private readonly IBudgetRepository _budgetRepository;
    private readonly IUserContext _userContext;
    private readonly IPublisher _publisher;

    public AddBudgetCommandHandler(IBudgetRepository budgetRepository, IUserContext userContext, IServiceProvider serviceProvider)
    {
        _budgetRepository = budgetRepository;
        _userContext = userContext;
        _publisher = serviceProvider.GetRequiredService<IPublisher>();
    }

    public async Task<Result<BudgetModel>> Handle(AddBudgetCommand request, CancellationToken cancellationToken)
    {
        var (userIdGetResult, usernameGetResult, emailGetResult) = 
            (_userContext.GetUserId(), _userContext.GetUserUsername(), _userContext.GetUserEmail());

        if (userIdGetResult.IsFailure)
        {
            return userIdGetResult.Error;
        }

        if (usernameGetResult.IsFailure)
        {
            return usernameGetResult.Error;
        }

        if (emailGetResult.IsFailure)
        {
            return emailGetResult.Error;
        }

        var userId = userIdGetResult.Value;
        var username = usernameGetResult.Value;
        var userEmail = emailGetResult.Value;

        var budgetCreateResult = Domain.Budgets.Budget.Create(request.BudgetName, userId, username, userEmail, request.BudgetCurrency);

        if (budgetCreateResult.IsFailure)
        {
            return budgetCreateResult.Error;
        }

        var budget = budgetCreateResult.Value;


        var budgetAddResult = await _budgetRepository.AddAsync(budget, cancellationToken);

        if (budgetAddResult.IsFailure)
        {
            return budgetAddResult.Error;
        }

        budget = budgetAddResult.Value;

        await Task.WhenAll(
            budget.GetDomainEvents()
                .Select(
                    async domainEvent => await _publisher.Publish(
                        domainEvent,
                        cancellationToken)));

        return BudgetModel.FromDomainModel(budget);
    }
}