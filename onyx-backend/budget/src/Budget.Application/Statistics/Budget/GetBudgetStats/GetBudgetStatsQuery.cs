using Abstractions.Messaging;

namespace Budget.Application.Statistics.Budget.GetBudgetStats;

public sealed record GetBudgetStatsQuery() : IQuery<BudgetStatistics>;
