using Abstractions.Messaging;
using Budget.Domain.Accounts;
using Budget.Domain.Subcategories;
using Budget.Domain.Transactions;
using Models.Responses;
using Transaction = Budget.Domain.Transactions.Transaction;

namespace Budget.Application.Transactions.BulkRemoveTransactions;

internal sealed class BulkRemoveTransactionsCommandHandler : ICommandHandler<BulkRemoveTransactionsCommand>
{
    private readonly ITransactionRepository _transactionRepository;
    private readonly IAccountRepository _accountRepository;
    private readonly ISubcategoryRepository _subcategoryRepository;

    public BulkRemoveTransactionsCommandHandler(ITransactionRepository transactionRepository, IAccountRepository accountRepository, ISubcategoryRepository subcategoryRepository)
    {
        _transactionRepository = transactionRepository;
        _accountRepository = accountRepository;
        _subcategoryRepository = subcategoryRepository;
    }

    public async Task<Result> Handle(BulkRemoveTransactionsCommand request, CancellationToken cancellationToken)
    {
        var requestTransactionIds = request.TransactionIds.Select(id => new TransactionId(id));
        var getTransactionResult = await _transactionRepository.GetManyByIdAsync(requestTransactionIds, cancellationToken);

        if (getTransactionResult.IsFailure)
        {
            return Result.Failure(getTransactionResult.Error);
        }

        var transactions = getTransactionResult.Value.ToList();

        var tasks = transactions.Select(t => RemoveTransactionRelations(t, cancellationToken));

        var removeTransactionRelationsResults = await Task.WhenAll(tasks);

        var (transactionsRemoveTasks, accountUpdateTasks, subcategoryRemoveTasks) = (
                transactions.Select(t => _transactionRepository.RemoveAsync(t.Id, cancellationToken)),
                removeTransactionRelationsResults.Select(x => x.accountUpdateTask),
                removeTransactionRelationsResults.Select(x => x.subcategoryUpdateTask));

        var results = await Task.WhenAll([..transactionsRemoveTasks, ..accountUpdateTasks, ..subcategoryRemoveTasks]);

        return Result.Aggregate(results);
    }

    private async Task<(Task<Result> subcategoryUpdateTask, Task<Result> accountUpdateTask)>
        RemoveTransactionRelations(
        Transaction transaction,
        CancellationToken cancellationToken)
    {
        var (subcategoryGetResult, accountGetResult) = (
            transaction.SubcategoryId is null ?
                null :
                await _subcategoryRepository.GetByIdAsync(transaction.SubcategoryId, cancellationToken),
            await _accountRepository.GetByIdAsync(transaction.AccountId, cancellationToken));

        if (Result.Aggregate([subcategoryGetResult ?? Result.Success(), accountGetResult]) is var result && result.IsFailure)
        {
            return (Task.FromResult(Result.Failure(result.Error)), 
                Task.FromResult(Result.Failure(result.Error)));
        }

        var subcategory = subcategoryGetResult?.Value;
        var account = accountGetResult.Value;

        var removeTransactionRelationsResult =  TransactionService.RemoveTransaction(transaction, account, subcategory);

        if (removeTransactionRelationsResult.IsFailure)
        {
            return (Task.FromResult(Result.Failure(removeTransactionRelationsResult.Error)),
                Task.FromResult(Result.Failure(removeTransactionRelationsResult.Error)));
        }

        return (
            subcategory is null ?
                Task.FromResult(Result.Success()) :
                Result.CreateVoidTask(_subcategoryRepository.UpdateAsync(subcategory, cancellationToken)),
            Result.CreateVoidTask(_accountRepository.UpdateAsync(account, cancellationToken)));
    }
}
