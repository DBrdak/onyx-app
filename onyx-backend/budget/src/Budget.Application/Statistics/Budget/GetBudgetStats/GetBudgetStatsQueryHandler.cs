using Abstractions.Messaging;
using Models.Responses;

namespace Budget.Application.Statistics.Budget.GetBudgetStats;

internal sealed class GetBudgetStatsQueryHandler : IQueryHandler<GetBudgetStatsQuery, BudgetStatistics>
{
    public async Task<Result<BudgetStatistics>> Handle(GetBudgetStatsQuery request, CancellationToken cancellationToken)
    {
        return null;
    }
}
