using Abstractions.Messaging;

namespace Budget.Application.Statistics.Categories.GetCategoryStats;

public sealed record GetCategoryStatsQuery() : IQuery<CategoriesStatistics>;
