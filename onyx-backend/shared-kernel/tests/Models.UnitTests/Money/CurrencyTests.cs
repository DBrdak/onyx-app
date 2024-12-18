using Models.Primitives;

namespace Models.UnitTests.Money;

public sealed class CurrencyTests
{
    [Fact]
    public void FromCode_Should_Success()
    {
        // Act
        var currenciesCreateResult = CurrencyData.ValidCurrencies.Select(Currency.FromCode);
        var isFailure = currenciesCreateResult.Any(result => result.IsFailure);

        // Assert
        Assert.False(isFailure);
    }

    [Fact]
    public void FromCode_Should_Fail()
    {
        // Act
        var currenciesCreateResult = CurrencyData.InvalidCurrencies.Select(Currency.FromCode);
        var isSuccess = currenciesCreateResult.Any(result => result.IsSuccess);

        // Assert
        Assert.False(isSuccess);
    }
}