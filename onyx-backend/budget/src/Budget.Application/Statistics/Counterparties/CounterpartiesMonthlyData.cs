using Models.Primitives;

namespace Budget.Application.Statistics.Counterparties;

public sealed record CounterpartiesMonthlyData(MonthDate Month, IEnumerable<CounterpartyMonthlyData> Counterparties);