using Budget.Domain.Budgets;
using Budget.Domain.Categories;
using Models.Responses;

namespace Budget.Domain.Counterparties;

public interface ICounterpartyRepository
{
    Task<Result<Counterparty>> AddAsync(Counterparty counterparty, CancellationToken cancellationToken);

    Task<Result> RemoveAsync(CounterpartyId counterpartyId, CancellationToken cancellationToken = default);

    Task<Result<Counterparty>> GetByIdAsync(CounterpartyId counterpartyId, CancellationToken cancellationToken);

    Task<Result<Counterparty>> UpdateAsync(Counterparty counterparty, CancellationToken cancellationToken);

    Task<Result<IEnumerable<Counterparty>>> GetManyByIdAsync(
        IEnumerable<CounterpartyId> ids,
        CancellationToken cancellationToken = default);

    Task<Result<IEnumerable<Counterparty>>> GetAllAsync(CancellationToken cancellationToken);

    Task<Result<Counterparty>> GetByNameAndTypeAsync(CounterpartyName counterpartyName, CounterpartyType counterpartyType, CancellationToken cancellationToken);

    Task<Result<IEnumerable<Counterparty>>> GetManyByTypeAsync(CounterpartyType counterpartyType, CancellationToken cancellationToken);

    Task<Result<Counterparty>> GetByNameAndTypeOrAddAsync(CounterpartyName name, CounterpartyType type, BudgetId budgetId, CancellationToken cancellationToken);
    Task<Result> RemoveRangeAsync(IEnumerable<CounterpartyId> entitiesId, CancellationToken cancellationToken = default);
}