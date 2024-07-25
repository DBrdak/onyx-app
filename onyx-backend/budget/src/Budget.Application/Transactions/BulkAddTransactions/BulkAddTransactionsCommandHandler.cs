using Abstractions.Messaging;
using Budget.Application.Transactions.Models;
using Budget.Domain.Transactions;
using Models.Responses;

namespace Budget.Application.Transactions.BulkAddTransactions;

internal sealed class BulkAddTransactionsCommandHandler : ICommandHandler<BulkAddTransactionsCommand, IEnumerable<TransactionModel>>
{
    private readonly ITransactionRepository _transactionRepository;

    public BulkAddTransactionsCommandHandler(ITransactionRepository transactionRepository)
    {
        _transactionRepository = transactionRepository;
    }

    public async Task<Result<IEnumerable<TransactionModel>>> Handle(BulkAddTransactionsCommand request, CancellationToken cancellationToken)
    {
        return null;
    }
}