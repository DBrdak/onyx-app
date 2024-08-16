using Amazon.DynamoDBv2.DocumentModel;
using Budget.Application.Abstractions.Identity;
using Budget.Domain.Budgets;
using Budget.Domain.Counterparties;
using Budget.Infrastructure.Data.DataModels.Counterparties;
using Models.Responses;
using SharedDAL;
using SharedDAL.DataModels.Abstractions;

namespace Budget.Infrastructure.Repositories;

internal sealed class CounterpartyRepository : BaseBudgetRepository<Counterparty, CounterpartyId>, ICounterpartyRepository
{
    public CounterpartyRepository(
        DbContext context,
        IBudgetContext budgetContext,
        IDataModelService<Counterparty> dataModelService) : base(
        context,
        budgetContext,
        dataModelService)
    {
    }

    public async Task<Result<Counterparty>> GetByNameAndTypeAsync(
        CounterpartyName counterpartyName,
        CounterpartyType counterpartyType,
        CancellationToken cancellationToken)
    {
        var scanFilter = new ScanFilter();
        scanFilter.AddCondition(
            nameof(CounterpartyDataModel.Name),
            ScanOperator.Equal,
            counterpartyName.Value);
        scanFilter.AddCondition(
            nameof(CounterpartyDataModel.Type),
            ScanOperator.Equal,
            counterpartyType.Value);
        
        return await GetFirstAsync(scanFilter, cancellationToken);
    }

    public async Task<Result<IEnumerable<Counterparty>>> GetManyByTypeAsync(CounterpartyType counterpartyType, CancellationToken cancellationToken)
    {
        var scanFilter = new ScanFilter();
        scanFilter.AddCondition(
            nameof(CounterpartyDataModel.Type),
            ScanOperator.Equal,
            counterpartyType.Value);

        return await GetWhereAsync(scanFilter, cancellationToken);
    }

    public async Task<Result<Counterparty>> GetByNameAndTypeOrAddAsync(
        CounterpartyName name,
        CounterpartyType type,
        BudgetId budgetId,
        CancellationToken cancellationToken)
    {
        var scanFilter = new ScanFilter();
        scanFilter.AddCondition(
            nameof(CounterpartyDataModel.Name),
            ScanOperator.Equal,
            name.Value);
        scanFilter.AddCondition(
            nameof(CounterpartyDataModel.Type),
            ScanOperator.Equal,
            type.Value);

        var counterpartyGetResult = await GetFirstAsync(scanFilter, cancellationToken);

        if (counterpartyGetResult.IsSuccess)
        {
            return counterpartyGetResult.Value;
        }

        var counterpartyCreateResult = Counterparty.Create(name.Value, type.Value, budgetId);

        if (counterpartyCreateResult.IsFailure)
        {
            return counterpartyCreateResult.Error;
        }

        return await AddAsync(counterpartyCreateResult.Value, cancellationToken);
    }
}