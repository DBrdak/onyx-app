﻿using Budget.Domain.Categories;
using Budget.Domain.Transactions;
using Models.Primitives;
using Models.Responses;

namespace Budget.Domain.Subcategories;

public sealed class SubcategoryService
{
    public static Result RemoveSubcategory(
        Subcategory subcategory,
        Category category,
        IEnumerable<Transaction> subcategoryTransactions,
        Subcategory unknownSubcategory) =>
        Result.Aggregate([
            category.RemoveSubcategory(subcategory),
            .. subcategoryTransactions.Select(transaction => transaction.RemoveSubcategory(unknownSubcategory)).ToArray()
        ]);

    public static Result<Assignment> UpdateAssignment(
        Subcategory subcategory,
        MonthDate assignmentMonth,
        Money assignedAmount) =>
        subcategory.Assign(
            assignmentMonth.Month, 
            assignmentMonth.Year, 
            assignedAmount) is var assignmentResult && assignmentResult.IsFailure ?
            subcategory.Reassign(
                assignmentMonth.Month,
                assignmentMonth.Year,
                assignedAmount) :
            Result.Success(assignmentResult.Value);

    public static Result UpdateSubcategory(
        Subcategory subcategory,
        string? name,
        string? description)
    {
        Result[] results = 
        [
            name is null ?
                Result.Success() : 
                subcategory.ChangeName(name),
            description is null ?
                Result.Success() : 
                subcategory.ChangeDescription(description)
        ];

        return results.FirstOrDefault(r => r.IsFailure) ?? Result.Success();
    }

    public static Result UpdateTarget(
        Subcategory subcategory,
        Target? currentTarget,
        Money targetAmount,
        MonthDate startedAt,
        MonthDate targetUpToMonth) =>
        currentTarget switch
        {
            null => subcategory.SetTarget(targetAmount, startedAt, targetUpToMonth),
            _ when currentTarget.TargetAmount != targetAmount && currentTarget.UpToMonth != targetUpToMonth => 
                Result.Aggregate([subcategory.UpdateTargetAmount(targetAmount), subcategory.MoveTargetEndMonth(targetUpToMonth)]),
            _ when currentTarget.TargetAmount != targetAmount => subcategory.UpdateTargetAmount(targetAmount),
            _ when currentTarget.UpToMonth != targetUpToMonth => subcategory.MoveTargetEndMonth(targetUpToMonth),
            _ => Result.Failure(Error.InvalidValue)
        };
}