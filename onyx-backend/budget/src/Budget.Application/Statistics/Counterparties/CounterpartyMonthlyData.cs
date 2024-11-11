using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Budget.Application.Contracts.Models;

namespace Budget.Application.Statistics.Counterparties;

public sealed record CounterpartyMonthlyData(string Name, MoneyModel SpentAmount, MoneyModel EarnedAmount);