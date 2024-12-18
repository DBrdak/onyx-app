﻿using Abstractions.Messaging;
using Budget.Application.Abstractions.Identity;
using Budget.Application.Subcategories.Models;
using Budget.Application.Subcategories.Validator;
using Budget.Domain.Budgets;
using Budget.Domain.Subcategories;
using Budget.Domain.Transactions;
using Models.Primitives;
using Models.Responses;

namespace Budget.Application.Subcategories.UpdateTarget;

internal sealed class UpdateTargetCommandHandler : ICommandHandler<UpdateTargetCommand, SubcategoryModel>
{
    private readonly ISubcategoryRepository _subcategoryRepository;
    private readonly ITransactionRepository _transactionRepository;
    private readonly IBudgetRepository _budgetRepository;
    private readonly IBudgetContext _budgetContext;
    private readonly SubcategoryGlobalValidator _validator;

    public UpdateTargetCommandHandler(
        ISubcategoryRepository subcategoryRepository,
        ITransactionRepository transactionRepository,
        IBudgetRepository budgetRepository,
        IBudgetContext budgetContext,
        SubcategoryGlobalValidator validator)
    {
        _subcategoryRepository = subcategoryRepository;
        _transactionRepository = transactionRepository;
        _budgetRepository = budgetRepository;
        _budgetContext = budgetContext;
        _validator = validator;
    }

    public async Task<Result<SubcategoryModel>> Handle(UpdateTargetCommand request, CancellationToken cancellationToken)
    {
        var subcategoryId = new SubcategoryId(request.SubcategoryId);

        var validationResult = await _validator.Validate(subcategoryId, cancellationToken);

        if (validationResult.IsFailure)
        {
            return validationResult.Error;
        }

        var budgetIdGetResult = _budgetContext.GetBudgetId();

        if (budgetIdGetResult.IsFailure)
        {
            return budgetIdGetResult.Error;
        }

        var budgetGetResult = await _budgetRepository.GetByIdAsync(
            new(budgetIdGetResult.Value),
            cancellationToken);

        if (budgetGetResult.IsFailure)
        {
            return budgetGetResult.Error;
        }

        var budget = budgetGetResult.Value;

        var subcategoryGetResult = await _subcategoryRepository.GetByIdAsync(subcategoryId, cancellationToken);

        if (subcategoryGetResult.IsFailure)
        {
            return Result.Failure<SubcategoryModel>(subcategoryGetResult.Error);
        }

        var subcategory = subcategoryGetResult.Value;

        var budgetCurrency = budget.BaseCurrency;

        var targetAmount = new Money(request.TargetAmount, budgetCurrency);
        var currentTarget = subcategory.Target;
        var isNewTarget = currentTarget is null;

        var targetUpdateResult = SubcategoryService.UpdateTarget(
            subcategory,
            currentTarget,
            targetAmount,
            request.StartedAt,
            request.TargetUpToMonth);

        if (targetUpdateResult.IsFailure)
        {
            return Result.Failure<SubcategoryModel>(targetUpdateResult.Error);
        }

        if (!isNewTarget)
        {
            return await _subcategoryRepository.UpdateAsync(subcategory, cancellationToken) is var result &&
                   result.IsFailure ?
                result.Error :
                SubcategoryModel.FromDomainModel(result.Value);
        }

        var newTarget = subcategory.Target!;

        var targetTransactResult = await AddExistingTransactionsForTarget(subcategory, newTarget, cancellationToken);

        if (targetTransactResult.IsFailure)
        {
            return targetTransactResult.Error;
        }

        var subcategoryUpdateResult = await _subcategoryRepository.UpdateAsync(subcategory, cancellationToken);

        if (subcategoryUpdateResult.IsFailure)
        {
            return subcategoryUpdateResult.Error;
        }

        return Result.Success(SubcategoryModel.FromDomainModel(subcategory));
    }


    private async Task<Result> AddExistingTransactionsForTarget(
        Subcategory subcategory,
        Target target,
        CancellationToken cancellationToken)
    {
        var relatedTransactionsGetResult = await _transactionRepository.GetForTargetAsync(
            subcategory.Id,
            target,
            cancellationToken);

        if (relatedTransactionsGetResult.IsFailure)
        {
            return relatedTransactionsGetResult.Error;
        }

        var relatedTransactions = relatedTransactionsGetResult.Value.ToArray();

        var targetTransactResults = relatedTransactions.Select(subcategory.TransactForTarget);

        if (Result.Aggregate(targetTransactResults) is var result && result.IsFailure)
        {
            return result.Error;
        }

        return Result.Success();
    }
}