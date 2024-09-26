using Models.Primitives;
using Models.Responses;

namespace Budget.Application.Contracts.Models;

public sealed record MoneyModel
{
    public decimal Amount { get; private set; }
    public string Currency { get; private set; }

    [System.Text.Json.Serialization.JsonConstructor]
    [Newtonsoft.Json.JsonConstructor]
    private MoneyModel(decimal amount, string currency)
    {
        Amount = amount;
        Currency = currency;
    }

    internal static MoneyModel FromDomainModel(Money money) => new(money.Amount, money.Currency.Code);

    internal Result<Money> ToDomainModel()
    {
        var currencyCreateResult = global::Models.Primitives.Currency.FromCode(Currency);

        if (currencyCreateResult.IsFailure)
        {
            return Result.Failure<Money>(currencyCreateResult.Error);
        }

        var currency = currencyCreateResult.Value;
        return new Money(Amount, currency);
    }
}