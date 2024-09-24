using Abstractions.Messaging;
using Models.Responses;

namespace Budget.Application.Statistics.Counterparties.GetCounterpartiesStats;

internal sealed class GetCounterpartiesStatsQueryHandler : IQueryHandler<GetCounterpartiesStatsQuery, CounterpartiesStatistics>
{
    public async Task<Result<CounterpartiesStatistics>> Handle(GetCounterpartiesStatsQuery request, CancellationToken cancellationToken)
    {
        return null;
    }
}
