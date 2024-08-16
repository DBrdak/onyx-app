﻿using Abstractions.Messaging;
using Budget.Application.Abstractions.Identity;
using Budget.Application.Subcategories.Models;
using Budget.Domain.Budgets;
using Budget.Domain.Subcategories;
using Budget.Domain.Transactions;
using Models.DataTypes;
using Models.Responses;
using System.ComponentModel.DataAnnotations;
using Budget.Application.Subcategories.Validator;

namespace Budget.Application.Subcategories.UpdateAssignment;

internal sealed class UpdateAssignmentCommandHandler : ICommandHandler<UpdateAssignmentCommand, SubcategoryModel>
{
    private readonly ISubcategoryRepository _subcategoryRepository;
    private readonly ITransactionRepository _transactionRepository;
    private readonly IBudgetContext _budgetContext;
    private readonly IBudgetRepository _budgetRepository;
    private readonly SubcategoryGlobalValidator _validator;

    public UpdateAssignmentCommandHandler(
        ISubcategoryRepository subcategoryRepository,
        ITransactionRepository transactionRepository,
        IBudgetContext budgetContext,
        IBudgetRepository budgetRepository,
        SubcategoryGlobalValidator validator)
    {
        _subcategoryRepository = subcategoryRepository;
        _transactionRepository = transactionRepository;
        _budgetContext = budgetContext;
        _budgetRepository = budgetRepository;
        _validator = validator;
    }

    public async Task<Result<SubcategoryModel>> Handle(UpdateAssignmentCommand request, CancellationToken cancellationToken)
    {
        var subcategoryId = new SubcategoryId(request.SubcategoryId);

        var validationResult = await _validator.Validate(subcategoryId, cancellationToken);

        if (validationResult.IsFailure)
        {
            return validationResult.Error;
        }

        var bugdetIdGetResult = _budgetContext.GetBudgetId();

        if (bugdetIdGetResult.IsFailure)
        {
            return bugdetIdGetResult.Error;
        }

        var budgetGetResult = await _budgetRepository.GetByIdAsync(new (bugdetIdGetResult.Value), cancellationToken);

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

        var assignmentBeforeUpdate = subcategory.GetAssignmentForMonth(request.AssignmentMonth);

        var budgetCurrency = budget.BaseCurrency;

        var assignedAmountMoney = new Money(request.AssignedAmount, budgetCurrency);

        var assignmentResult = SubcategoryService.UpdateAssignment(
            subcategory,
            request.AssignmentMonth,
            assignedAmountMoney);

        if (assignmentResult.IsFailure)
        {
            return Result.Failure<SubcategoryModel>(assignmentResult.Error);
        }

        if (assignmentBeforeUpdate is not null)
        {
            return await _subcategoryRepository.UpdateAsync(subcategory, cancellationToken) is var result &&
                   result.IsFailure ?
                result.Error :
                SubcategoryModel.FromDomainModel(result.Value);
        }

        var assignmentTransactionsAddResult = await AddExistingTransactionsForAssignment(
            subcategory,
            assignmentResult.Value,
            cancellationToken);

        if (assignmentTransactionsAddResult.IsFailure)
        {
            return assignmentTransactionsAddResult.Error;
        }

        var subcategoryUpdateResult = await _subcategoryRepository.UpdateAsync(subcategory, cancellationToken);

        if (subcategoryUpdateResult.IsFailure)
        {
            return subcategoryUpdateResult.Error;
        }

        subcategory = subcategoryUpdateResult.Value;

        return Result.Success(SubcategoryModel.FromDomainModel(subcategory));
    }

    private async Task<Result> AddExistingTransactionsForAssignment(
        Subcategory subcategory,
        Assignment assignment,
        CancellationToken cancellationToken)
    {
        var relatedTransactionsGetResult = await _transactionRepository.GetForAssignmentAsync(
            subcategory.Id,
            assignment,
            cancellationToken);

        if (relatedTransactionsGetResult.IsFailure)
        {
            return relatedTransactionsGetResult.Error;
        }

        var relatedTransactions = relatedTransactionsGetResult.Value.ToArray();

        var assignmentTransactResults = relatedTransactions.Select(subcategory.TransactForAssignment);

        if (Result.Aggregate(assignmentTransactResults) is var result && result.IsFailure)
        {
            return result.Error;
        }

        return Result.Success();
    }
}