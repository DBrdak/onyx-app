using Budget.Application.Contracts.Models;

namespace Budget.Application.Statistics.Counterparties;

public sealed record CounterpartyMonthlyData(string Name, MoneyModel SpentAmount, MoneyModel EarnedAmount);