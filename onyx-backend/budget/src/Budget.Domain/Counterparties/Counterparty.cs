﻿using Budget.Domain.Budgets;
using Budget.Domain.Shared.Abstractions;
using Models.Responses;

namespace Budget.Domain.Counterparties;

public sealed class Counterparty : BudgetOwnedEntity<CounterpartyId>
{

    public CounterpartyName Name { get; private set; }
    public CounterpartyType Type { get; init; }

    [Newtonsoft.Json.JsonConstructor]
    [System.Text.Json.Serialization.JsonConstructor]
    private Counterparty(
        CounterpartyName name,
        CounterpartyType type,
        BudgetId budgetId,
        CounterpartyId? id = null,
        long? createdAt = null) : base(budgetId, id ?? new CounterpartyId(), createdAt)
    {
        Name = name;
        Type = type;
    }

    public Result ChangeName(string name)
    {
        var counterpartyNameCreateResult = CounterpartyName.Create(name);

        if (counterpartyNameCreateResult.IsFailure)
        {
            return Result.Failure(counterpartyNameCreateResult.Error);
        }

        var counterpartyName = counterpartyNameCreateResult.Value;
        Name = counterpartyName;

        return Result.Success();
    }

    public static Result<Counterparty> Create(string name, string type, BudgetId budgetId)
    {
        var counterpartyNameCreateResult = CounterpartyName.Create(name);

        if (counterpartyNameCreateResult.IsFailure)
        {
            return Result.Failure<Counterparty>(counterpartyNameCreateResult.Error);
        }

        var counterpartyName = counterpartyNameCreateResult.Value;

        var counterpartyTypeCreateResult = CounterpartyType.Create(type);

        if (counterpartyTypeCreateResult.IsFailure)
        {
            return Result.Failure<Counterparty>(counterpartyTypeCreateResult.Error);
        }

        var counterpartyType = counterpartyTypeCreateResult.Value;

        return new Counterparty(counterpartyName, counterpartyType, budgetId);
    }
}