using Abstractions.Messaging;

namespace Budget.Application.Statistics.Counterparties.GetCounterpartiesStats;

public sealed record GetCounterpartiesStatsQuery() : IQuery<CounterpartiesStatistics>;
