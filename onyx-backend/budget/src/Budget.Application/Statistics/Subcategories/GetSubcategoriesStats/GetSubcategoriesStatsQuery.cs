using Abstractions.Messaging;

namespace Budget.Application.Statistics.Subcategories.GetSubcategoriesStats;

public sealed record GetSubcategoriesStatsQuery() : IQuery<SubcategoriesStatistics>;
