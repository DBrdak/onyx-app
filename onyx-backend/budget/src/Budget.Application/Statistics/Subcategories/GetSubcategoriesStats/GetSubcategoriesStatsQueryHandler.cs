using Abstractions.Messaging;
using Models.Responses;

namespace Budget.Application.Statistics.Subcategories.GetSubcategoriesStats;

internal sealed class GetSubcategoriesStatsQueryHandler : IQueryHandler<GetSubcategoriesStatsQuery, SubcategoriesStatistics>
{
    public async Task<Result<SubcategoriesStatistics>> Handle(GetSubcategoriesStatsQuery request, CancellationToken cancellationToken)
    {
        return null;
    }
}
