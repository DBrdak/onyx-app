using Abstractions.Messaging;
using Budget.Application.Transactions.Models;
using Budget.Domain.Accounts;
using Budget.Domain.Counterparties;
using Budget.Domain.Subcategories;
using Budget.Domain.Transactions;
using Extensions;
using Models.Primitives;
using Models.Responses;
using System.Globalization;
using Amazon.Lambda.Core;
using Microsoft.Extensions.Logging;
using Transaction = Budget.Domain.Transactions.Transaction;

namespace Budget.Application.Transactions.GetTransactions;

internal sealed class GetTransactionsQueryHandler : IQueryHandler<GetTransactionsQuery, IEnumerable<TransactionModel>>
{
    private readonly ITransactionRepository _transactionRepository;
    private readonly ISubcategoryRepository _subcategoryRepository;
    private readonly IAccountRepository _accountRepository;
    private readonly ICounterpartyRepository _counterpartyRepository;

    public GetTransactionsQueryHandler(
        ITransactionRepository transactionRepository,
        ICounterpartyRepository counterpartyRepository,
        ISubcategoryRepository subcategoryRepository,
        IAccountRepository accountRepository)
    {
        _transactionRepository = transactionRepository;
        _counterpartyRepository = counterpartyRepository;
        _subcategoryRepository = subcategoryRepository;
        _accountRepository = accountRepository;
    }

    public async Task<Result<IEnumerable<TransactionModel>>> Handle(GetTransactionsQuery request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.DateRangeStart) ||
            string.IsNullOrWhiteSpace(request.DateRangeEnd))
        {
            return GetTransactionErrors.NullFilters;
        }

        Period? dateRange = null;
        var isValidStartDate = DateTimeOffset.TryParseExact(
            request.DateRangeStart,
            "O",
            null,
            DateTimeStyles.None,
            out var startDate);
        var isValidEndDate = DateTimeOffset.TryParseExact(
            request.DateRangeEnd,
            "O",
            null,
            DateTimeStyles.None,
            out var endDate);

        if (!isValidStartDate || !isValidEndDate)
        {
            return GetTransactionErrors.InvalidDate;
        }

        if (isValidStartDate && isValidEndDate)
        {
            var dateRangeCreateResult = Period.Create(
                startDate,
                endDate,
                TimeSpan.TicksPerDay * 365);

            if (dateRangeCreateResult.IsFailure)
            {
                return dateRangeCreateResult.Error;
            }

            dateRange = dateRangeCreateResult.Value;
        }
        
        _transactionRepository.AddPagingParameters(dateRange!);

        var transactionsGetTask = request switch
        {
            _ when request.AccountId is not null =>
                _transactionRepository.GetByAccountAsync(new (request.AccountId!.Value), cancellationToken),
            _ when request.SubcategoryId is not null  =>
                _transactionRepository.GetBySubcategoryAsync(new(request.SubcategoryId!.Value), cancellationToken),
            _ when request.CounterpartyId is not null =>
                _transactionRepository.GetByCounterpartyAsync(new(request.CounterpartyId!.Value), cancellationToken),
            _ => _transactionRepository.GetAllPagedAsync(cancellationToken)
        };

        var transactionsGetResult = await transactionsGetTask;

        if (transactionsGetResult.IsFailure)
        {
            return transactionsGetResult.Error;
        }

        var transactions = transactionsGetResult.Value;

        var transactionModelsGetResults = await Task.WhenAll(
            GetTransactionModelsTasks(
                transactions,
                cancellationToken));

        if (transactionModelsGetResults.FirstOrDefault(r => r.IsFailure) is not null and var failureResult)
        {
            return failureResult.Error;
        }

        var transactionModels = transactionModelsGetResults.Select(r => r.Value);

        return Result.Create(transactionModels);
    }

    private IEnumerable<Task<Result<TransactionModel>>> GetTransactionModelsTasks(
        IEnumerable<Transaction> transactions,
        CancellationToken cancellationToken)
    {
        var tasks = new List<Task<Result<TransactionModel>>>();

        foreach (var t in transactions)
        {
            var task = async () =>
            {
                var accountGetResult = await _accountRepository.GetByIdAsync(t.AccountId, cancellationToken);

                if (accountGetResult.IsFailure)
                {
                    return Result.Failure<TransactionModel>(accountGetResult.Error);
                }

                var subcategoryGetResult = t.SubcategoryId is null ?
                    null :
                    await _subcategoryRepository.GetByIdAsync(t.SubcategoryId, cancellationToken);

                if (subcategoryGetResult is not null && subcategoryGetResult.IsFailure)
                {
                    return Result.Failure<TransactionModel>(subcategoryGetResult.Error);
                }

                var counterpartyGetResult = t.CounterpartyId is null ?
                    null :
                    await _counterpartyRepository.GetByIdAsync(
                        t.CounterpartyId,
                        cancellationToken);

                if (counterpartyGetResult is not null && counterpartyGetResult.IsFailure)
                {
                    return Result.Failure<TransactionModel>(counterpartyGetResult.Error);
                }

                var account = accountGetResult.Value;
                var subcategory = subcategoryGetResult?.Value;
                var counterparty = counterpartyGetResult?.Value;

                return Result.Create(TransactionModel.FromDomainModel(t, counterparty, account, subcategory));
            };

            tasks.Add(task.Invoke());
        }

        return tasks;
    }
}