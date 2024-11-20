using Budget.Application.Contracts.Models;
using Models.Primitives;

namespace Budget.Application.Statistics.Counterparties;

public sealed record CounterpartyMonthlyData(
    MonthModel Month,
    MoneyModel SpentAmount,
    MoneyModel EarnedAmount);