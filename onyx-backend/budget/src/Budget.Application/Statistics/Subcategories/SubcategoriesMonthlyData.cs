using Models.Primitives;

namespace Budget.Application.Statistics.Subcategories;

public sealed record SubcategoriesMonthlyData(MonthDate Month, IEnumerable<SubcategoryMonthlyData> Subcategories);