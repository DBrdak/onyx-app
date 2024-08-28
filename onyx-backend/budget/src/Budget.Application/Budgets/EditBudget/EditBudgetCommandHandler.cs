using Abstractions.Messaging;
using Budget.Application.Budgets.Models;
using Budget.Domain.Budgets;
using Models.Responses;

namespace Budget.Application.Budgets.EditBudget;

internal sealed class EditBudgetCommandHandler : ICommandHandler<EditBudgetCommand, BudgetModel>
{
    private readonly IBudgetRepository _budgetRepository;

    public EditBudgetCommandHandler(IBudgetRepository budgetRepository)
    {
        _budgetRepository = budgetRepository;
    }

    public async Task<Result<BudgetModel>> Handle(EditBudgetCommand request, CancellationToken cancellationToken)
    {
        var budgetGetResult = await _budgetRepository.GetCurrentBudgetAsync(cancellationToken);

        if (budgetGetResult.IsFailure)
        {
            return budgetGetResult.Error;
        }

        var budget = budgetGetResult.Value;

        var budgetEditResult = budget.EditBudgetName(request.NewBudgetName);

        if (budgetEditResult.IsFailure)
        {
            return budgetEditResult.Error;
        }

        var updateResult = await _budgetRepository.UpdateAsync(budget, cancellationToken);

        if (updateResult.IsFailure)
        {
            return updateResult.Error;
        }

        return BudgetModel.FromDomainModel(updateResult.Value);
    }
}
