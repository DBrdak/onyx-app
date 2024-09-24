using Abstractions.Messaging;
using Models.Responses;

namespace Budget.Application.Statistics.Accounts.GetAccountsStats;

internal sealed class GetAccountsStatsQueryHandler : IQueryHandler<GetAccountsStatsQuery, AccountsStatistics>
{
    public async Task<Result<AccountsStatistics>> Handle(GetAccountsStatsQuery request, CancellationToken cancellationToken)
    {
        return null;
    }
}
