using Abstractions.Messaging;
using Budget.Application.Abstractions.Identity;
using Budget.Application.Budgets.Models;
using Budget.Domain.Budgets;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using Models.Responses;

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

    //TODO Send event that the budget is created, so identity service can add the budgetId to token
    public async Task<Result<BudgetModel>> Handle(AddBudgetCommand request, CancellationToken cancellationToken)
    {
        var (userIdGetResult, usernameGetResult, emailGetResult) = 
            (_userContext.GetUserId(), _userContext.GetUserUsername(), _userContext.GetUserEmail());

        if (Result.Aggregate(
                userIdGetResult,
                usernameGetResult,
                emailGetResult) is var result &&
            result.IsFailure)
        {
            return result.Error;
        }

        var userId = userIdGetResult.Value;
        var username = userIdGetResult.Value;
        var userEmail = userIdGetResult.Value;

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