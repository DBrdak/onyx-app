using Abstractions.Messaging;
using Budget.Domain.Accounts;
using Models.Responses;

namespace Budget.Application.Statistics.Accounts.GetAccountsStats;

internal sealed class GetAccountsStatsQueryHandler : IQueryHandler<GetAccountsStatsQuery, AccountsStatistics>
{
    private readonly IAccountRepository _accountsRepository;

    public GetAccountsStatsQueryHandler(IAccountRepository accountsRepository)
    {
        _accountsRepository = accountsRepository;
    }

    public async Task<Result<AccountsStatistics>> Handle(GetAccountsStatsQuery request, CancellationToken cancellationToken)
    {
        return null;
    }
}
