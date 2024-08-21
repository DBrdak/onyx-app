using Amazon.DynamoDBv2.DocumentModel;
using Budget.Application.Abstractions.Identity;
using Budget.Domain.Budgets;
using Budget.Infrastructure.Data.DataModels.Budgets;
using Models.Responses;
using SharedDAL;
using SharedDAL.DataModels.Abstractions;

namespace Budget.Infrastructure.Repositories;

internal sealed class BudgetRepository : Repository<Domain.Budgets.Budget, BudgetId>, IBudgetRepository
{
    private readonly IBudgetContext _budgetContext;
    private readonly IUserContext _userContext;

    public BudgetRepository(
        DbContext context,
        IBudgetContext budgetContext,
        IDataModelService<Domain.Budgets.Budget> dataModelService,
        IUserContext userContext) : base(
        context,
        dataModelService)
    {
        _budgetContext = budgetContext;
        _userContext = userContext;
    }

    public async Task<Result<Domain.Budgets.Budget>> GetCurrentBudgetAsync(CancellationToken cancellationToken)
    {
        var budgetIdGetResult = _budgetContext.GetBudgetId();

        if (budgetIdGetResult.IsFailure)
        {
            return budgetIdGetResult.Error;
        }

        var budgetId = new BudgetId(budgetIdGetResult.Value);

        return await GetByIdAsync(budgetId, cancellationToken);
    }

    public async Task<Result<IEnumerable<Domain.Budgets.Budget>>> GetBudgetsForMemberAsync(string memberId, CancellationToken cancellationToken)
    {
        var scanFilter = new ScanFilter();
        scanFilter.AddCondition(nameof(BudgetDataModel.BudgetMembersId), ScanOperator.Contains, memberId);

        return await GetWhereAsync(scanFilter, cancellationToken);
    }

    public async Task<Result<Domain.Budgets.Budget>> AddUniqueAsync(Domain.Budgets.Budget entity, CancellationToken cancellationToken = default)
    {
        var userIdGetResult = _userContext.GetUserId();

        if (userIdGetResult.IsFailure)
        {
            return userIdGetResult.Error;
        }

        var userId = userIdGetResult.Value;

        var scanFilter = new ScanFilter();
        scanFilter.AddCondition(nameof(BudgetDataModel.Name), ScanOperator.Equal, entity.Name.Value);
        scanFilter.AddCondition(nameof(BudgetDataModel.BudgetMembersId), ScanOperator.Contains, userId);

        var scanner = Table.Scan(scanFilter);

        var docs = new List<Document>();

        do
            docs.AddRange(await scanner.GetNextSetAsync(cancellationToken));
        while (!scanner.IsDone);

        var records = docs.Select(DataModelService.ConvertDocumentToDataModel);
        var enitites = records.Select(record => record.ToDomainModel());

        if (enitites.Any())
        {
            return DataAccessErrors<Domain.Budgets.Budget>.MustBeUnique;
        }

        return await AddAsync(entity, cancellationToken);
    }
}