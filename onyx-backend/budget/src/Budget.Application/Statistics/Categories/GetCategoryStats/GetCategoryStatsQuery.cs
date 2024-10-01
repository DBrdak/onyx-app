using Abstractions.Messaging;

namespace Budget.Application.Statistics.Categories.GetCategoryStats;

public sealed record GetCategoryStatsQuery(
    int FromMonth,
    int FromYear,
    int ToMonth,
    int ToYear) : IQuery<CategoriesStatistics>;
