using Models.Primitives;

namespace Budget.Application.Statistics.Categories;

public sealed record CategoriesMonthlyData(MonthDate Month, IEnumerable<CategoryMonthlyData> Categories);