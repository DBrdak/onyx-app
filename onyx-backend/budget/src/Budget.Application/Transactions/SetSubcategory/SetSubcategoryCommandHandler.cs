using Abstractions.Messaging;
using Budget.Application.Transactions.Models;
using Budget.Domain.Budgets;
using Budget.Domain.Subcategories;
using Budget.Domain.Transactions;
using Models.Responses;

namespace Budget.Application.Transactions.SetSubcategory;

internal sealed class SetSubcategoryCommandHandler : ICommandHandler<SetSubcategoryCommand>
{
    private readonly ITransactionRepository _transactionRepository;
    private readonly ISubcategoryRepository _subcategoryRepository;
    private readonly IBudgetRepository _budgetRepository;

    public SetSubcategoryCommandHandler(
        ISubcategoryRepository subcategoryRepository,
        ITransactionRepository transactionRepository,
        IBudgetRepository budgetRepository)
    {
        _subcategoryRepository = subcategoryRepository;
        _transactionRepository = transactionRepository;
        _budgetRepository = budgetRepository;
    }

    public async Task<Result> Handle(SetSubcategoryCommand request, CancellationToken cancellationToken)
    {
        var subcategoryId = new SubcategoryId(request.SubcategoryId);
        var transactionId = new TransactionId(request.TransactionId);

        var budgetGetResult = await _budgetRepository.GetCurrentBudgetAsync(cancellationToken);

        if (budgetGetResult.IsFailure)
        {
            return budgetGetResult.Error;
        }

        var budget = budgetGetResult.Value;
        var unknownSubcategoryId = budget.UnknownSubcategoryId;

        if (unknownSubcategoryId is null)
        {
            return SetSubcategoryErrors.UnknownSubcategoryNotFoundError;
        }

        var subcategoryGetResult = await _subcategoryRepository.GetByIdAsync(subcategoryId, cancellationToken);

        if (subcategoryGetResult.IsFailure)
        {
            return subcategoryGetResult.Error;
        }

        var subcategory = subcategoryGetResult.Value;

        var unknownSubcategoryGetResult = await _subcategoryRepository.GetByIdAsync(
            unknownSubcategoryId,
            cancellationToken);

        if (unknownSubcategoryGetResult.IsFailure)
        {
            return unknownSubcategoryGetResult.Error;
        }

        var unknownSubcategory = unknownSubcategoryGetResult.Value;

        var transactionGetResult =
            await _transactionRepository.GetByIdAsync(transactionId, cancellationToken);

        if (transactionGetResult.IsFailure)
        {
            return transactionGetResult.Error;
        }

        var transaction = transactionGetResult.Value;

        var setSubcategoryResult = TransactionService.SetSubcategory(
            transaction,
            subcategory,
            unknownSubcategory);

        if (setSubcategoryResult.IsFailure)
        {
            return setSubcategoryResult.Error;
        }

        Task<Result>[] updateTasks =
        [
            _transactionRepository.UpdateRangeAsync([transaction], cancellationToken),
            _subcategoryRepository.UpdateRangeAsync([unknownSubcategory, subcategory], cancellationToken)
        ];

        var updateResult = await Task.WhenAll(updateTasks);

        return Result.Aggregate(updateResult);
    }
}