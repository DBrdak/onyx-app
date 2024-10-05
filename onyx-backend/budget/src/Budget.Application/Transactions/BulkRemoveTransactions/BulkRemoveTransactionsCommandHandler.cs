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
    private readonly List<Task<Result<Subcategory>>> _subcategoryUpdateTasks = [];
    private readonly List<Task<Result<Account>>> _accountUpdateTasks = [];

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

        await Task.WhenAll(tasks);

        var transactionsRemoveTasks = transactions.Select(
                t => _transactionRepository.RemoveAsync(
                    t.Id,
                    cancellationToken))
            .ToList();

        await Task.WhenAll([..transactionsRemoveTasks, .._accountUpdateTasks, .._subcategoryUpdateTasks]);

        var transactionsRemoveResults = transactionsRemoveTasks.Select(t => t.Result).ToList();
        var subcategoryUpdateResults = _subcategoryUpdateTasks.Select(t => t.Result).ToList();
        var accountUpdateResults = _accountUpdateTasks.Select(t => t.Result).ToList();

        return Result.Aggregate([.. transactionsRemoveResults, ..subcategoryUpdateResults, ..accountUpdateResults]);
    }

    private async Task<Result>
        RemoveTransactionRelations(
        Transaction transaction,
        CancellationToken cancellationToken)
    {
        var subcategoryGetResult = transaction.SubcategoryId is null ?
            null :
            await _subcategoryRepository.GetByIdAsync(
                transaction.SubcategoryId,
                cancellationToken);

        var accountGetResult = await _accountRepository.GetByIdAsync(transaction.AccountId, cancellationToken);

        if (Result.Aggregate([subcategoryGetResult ?? Result.Success(), accountGetResult]) is var result && result.IsFailure)
        {
            return result.Error;
        }

        var subcategory = subcategoryGetResult?.Value;
        var account = accountGetResult.Value;

        var removeTransactionRelationsResult =  TransactionService.RemoveTransaction(transaction, account, subcategory);

        if (removeTransactionRelationsResult.IsFailure)
        {
            return removeTransactionRelationsResult.Error;
        }

        if (subcategory is not null)
        {
            _subcategoryUpdateTasks.Add(_subcategoryRepository.UpdateAsync(subcategory, cancellationToken));
        }

        _accountUpdateTasks.Add(_accountRepository.UpdateAsync(account, cancellationToken));

        return Result.Success();
    }
}
