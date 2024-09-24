using Abstractions.Messaging;
using Models.Responses;

namespace Budget.Application.Statistics.Categories.GetCategoryStats;

internal sealed class GetCategoryStatsQueryHandler : IQueryHandler<GetCategoryStatsQuery, CategoriesStatistics>
{
    public async Task<Result<CategoriesStatistics>> Handle(GetCategoryStatsQuery request, CancellationToken cancellationToken)
    {
        return null;
    }
}
