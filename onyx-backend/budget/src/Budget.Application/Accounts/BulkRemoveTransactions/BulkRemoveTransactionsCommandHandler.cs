using Abstractions.Messaging;
using Budget.Domain.Accounts;
using Budget.Domain.Subcategories;
using Budget.Domain.Transactions;
using Models.Responses;
using System.Transactions;
using Budget.Application.Categories.Validator;
using Transaction = Budget.Domain.Transactions.Transaction;

namespace Budget.Application.Accounts.BulkRemoveTransactions;

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

        var accountGetResult = await _accountRepository.GetByIdAsync(new AccountId(request.AccountId), cancellationToken);

        if (accountGetResult.IsFailure)
        {
            return accountGetResult.Error;
        }

        var account = accountGetResult.Value;

        var getTransactionsResult = await _transactionRepository.GetManyByIdAsync(requestTransactionIds, cancellationToken);

        if (getTransactionsResult.IsFailure)
        {
            return Result.Failure(getTransactionsResult.Error);
        }

        var transactions = getTransactionsResult.Value.ToList();

        var subcategoriesIds = transactions
            .Where(t => t.SubcategoryId is not null)
            .Select(t => t.SubcategoryId!)
            .ToList();

        var subcategoriesGetResult = await _subcategoryRepository.GetManyByIdAsync(subcategoriesIds, cancellationToken);

        if (subcategoriesGetResult.IsFailure)
        {
            return subcategoriesGetResult.Error;
        }

        var subcategories = subcategoriesGetResult.Value.ToList();

        var transactionSubcategoryPairs = (from transaction in transactions
            from subcategory in subcategories.Where(
                s => s.Id == transaction.SubcategoryId)
            select transaction).ToDictionary(
            transaction => transaction,
            transaction => subcategories.First(s => s.Id == transaction.SubcategoryId));

        var removeResults = transactionSubcategoryPairs.Select(
            pair => TransactionService.RemoveTransaction(pair.Key, account, pair.Value));

        if (Result.Aggregate(removeResults) is var result && result.IsFailure)
        {
            return result.Error;
        }

        var transactionsRemoveResult = await _transactionRepository.RemoveRangeAsync(
            transactions.Select(t => t.Id),
            cancellationToken);

        var accountUpdateResult = await _accountRepository.UpdateAsync(
            accountGetResult.Value,
            cancellationToken);

        var subcategoriesUpdateResult = await _subcategoryRepository.UpdateRangeAsync(subcategories, cancellationToken);

        return Result.Aggregate([transactionsRemoveResult, accountUpdateResult, subcategoriesUpdateResult]);
    }

}
