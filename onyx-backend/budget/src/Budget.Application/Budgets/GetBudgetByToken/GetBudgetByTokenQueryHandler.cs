using Abstractions.Messaging;
using Budget.Application.Budgets.Models;
using Budget.Domain.Budgets;
using Models.Responses;

namespace Budget.Application.Budgets.GetBudgetByToken;

internal sealed class GetBudgetByTokenQueryHandler : IQueryHandler<GetBudgetByTokenQuery, BudgetModel>
{
    private readonly IBudgetRepository _budgetRepository;

    public GetBudgetByTokenQueryHandler(IBudgetRepository budgetRepository)
    {
        _budgetRepository = budgetRepository;
    }

    public async Task<Result<BudgetModel>> Handle(GetBudgetByTokenQuery request, CancellationToken cancellationToken)
    {
        var budgetIdGetResult = BudgetInvitationToken.GetBudgetIdFromToken(request.Token);

        if (budgetIdGetResult.IsFailure)
        {
            return budgetIdGetResult.Error;
        }

        var budgetId = budgetIdGetResult.Value;

        var budgetGetResult = await _budgetRepository.GetByIdAsync(budgetId, cancellationToken);

        if (budgetGetResult.IsFailure)
        {
            return budgetGetResult.Error;
        }

        var budget = budgetGetResult.Value;

        return BudgetModel.FromDomainModel(budget);
    }
}
