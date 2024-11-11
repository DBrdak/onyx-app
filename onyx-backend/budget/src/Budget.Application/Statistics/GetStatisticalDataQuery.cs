using Abstractions.Messaging;
using Budget.Application.Statistics.Shared;
using Models.Primitives;

namespace Budget.Application.Statistics;

public sealed record GetStatisticalDataQuery : IQuery<StatisticalData>;