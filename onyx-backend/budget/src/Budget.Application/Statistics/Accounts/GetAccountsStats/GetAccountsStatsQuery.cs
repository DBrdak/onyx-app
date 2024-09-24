using Abstractions.Messaging;

namespace Budget.Application.Statistics.Accounts.GetAccountsStats;

public sealed record GetAccountsStatsQuery() : IQuery<AccountsStatistics>;
