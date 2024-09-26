using Models.Primitives;
using Models.Responses;

namespace Budget.Application.Abstractions.Currency;

public interface ICurrencyConverter
{
    Task<Result<Money>> ConvertMoney(
        Money amount,
        Models.Primitives.Currency destinationCurrency,
        CancellationToken cancellationToken = default);
}