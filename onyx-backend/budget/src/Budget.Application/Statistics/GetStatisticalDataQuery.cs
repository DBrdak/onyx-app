using Abstractions.Messaging;
using Budget.Application.Statistics.Shared;

namespace Budget.Application.Statistics;

public sealed record GetStatisticalDataQuery : IQuery<StatisticalData>;