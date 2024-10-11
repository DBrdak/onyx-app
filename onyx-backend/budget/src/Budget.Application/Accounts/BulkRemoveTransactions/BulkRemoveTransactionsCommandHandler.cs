using Abstractions.Messaging;
using Amazon.Lambda.Core;
using Budget.Application.Accounts.Models;
using Budget.Domain.Accounts;
using Budget.Domain.Subcategories;
using Budget.Domain.Transactions;
using Models.Responses;
using Newtonsoft.Json;

namespace Budget.Application.Accounts.BulkRemoveTransactions;

internal sealed class BulkRemoveTransactionsCommandHandler : ICommandHandler<BulkRemoveTransactionsCommand, AccountModel>
{
    private readonly ITransactionRepository _transactionRepository;
    private readonly IAccountRepository _accountRepository;
    private readonly ISubcategoryRepository _subcategoryRepository;

    public BulkRemoveTransactionsCommandHandler(
        ITransactionRepository transactionRepository,
        IAccountRepository accountRepository,
        ISubcategoryRepository subcategoryRepository)
    {
        _transactionRepository = transactionRepository;
        _accountRepository = accountRepository;
        _subcategoryRepository = subcategoryRepository;
    }

    public async Task<Result<AccountModel>> Handle(BulkRemoveTransactionsCommand request, CancellationToken cancellationToken)
    {
        LambdaLogger.Log("request: " + JsonConvert.SerializeObject(request));
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
            return getTransactionsResult.Error;
        }

        var transactions = getTransactionsResult.Value.ToList();

        var subcategoriesIds = transactions
            .Where(t => t.SubcategoryId is not null)
            .Select(t => t.SubcategoryId!)
            .Distinct()
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

        var finalResult = Result.Aggregate([transactionsRemoveResult, accountUpdateResult, subcategoriesUpdateResult]);

        if (finalResult.IsFailure)
        {
            return finalResult.Error;
        }

        return AccountModel.FromDomainModel(account);
    }

}
