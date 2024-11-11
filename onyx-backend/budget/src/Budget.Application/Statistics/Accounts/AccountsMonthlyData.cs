using Models.Primitives;

namespace Budget.Application.Statistics.Accounts;

public sealed record AccountsMonthlyData(MonthDate Month, IEnumerable<AccountMonthlyData> Accounts);