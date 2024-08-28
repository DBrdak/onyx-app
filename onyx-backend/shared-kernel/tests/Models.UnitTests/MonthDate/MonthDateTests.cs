using Models.DataTypes;
using Models.UnitTests.Money;

namespace Models.UnitTests.MonthDate;

public sealed class MonthDateTests
{
    [Fact]
    public void Create_Should_Success()
    {
        // Act
        var monthDatesCreateResult =
            MonthDateData.ValidMonthsYears.Select(x => DataTypes.MonthDate.Create(x.Month, x.Year));
        var isFailure = monthDatesCreateResult.Any(result => result.IsFailure);

        // Assert
        Assert.False(isFailure);
    }

    [Fact]
    public void Create_Should_Fail()
    {
        // Act
        var monthDatesCreateResult = MonthDateData.InvalidMonthsYears.Select(x => DataTypes.MonthDate.Create(x.Month, x.Year));
        var isSuccess = monthDatesCreateResult.Any(result => result.IsSuccess);

        // Assert
        Assert.False(isSuccess);
    }

    [Fact]
    public void MonthsInterval_Should_Success()
    {
        // Act
        var positiveInterval = DataTypes.MonthDate.MonthsInterval(
            MonthDateData.ExampleLater,
            MonthDateData.ExampleEarlier);
        var negativeInterval = DataTypes.MonthDate.MonthsInterval(
            MonthDateData.ExampleEarlier,
            MonthDateData.ExampleLater);

        // Assert
        Assert.Equal(MonthDateData.ExamplesMonthsPositiveInterval, positiveInterval);
        Assert.Equal(MonthDateData.ExamplesMonthsNegativeInterval, negativeInterval);
    }

    [Fact]
    public void ContainsDate_Should_Success()
    {
        // Act
        var isContaining = MonthDateData.ExampleLater.ContainsDate(MonthDateData.ContainedDate);

        // Assert
        Assert.True(isContaining);
    }

    [Fact]
    public void ContainsDate_Should_Fail()
    {
        // Act
        var isContaining = MonthDateData.ExampleLater.ContainsDate(MonthDateData.NotContainedDate);

        // Assert
        Assert.False(isContaining);
    }

    [Fact]
    public void BoolOperators_Should_Success()
    {
        // Assert
        Assert.True(MonthDateData.ExampleLater > MonthDateData.ExampleEarlier);
        Assert.False(MonthDateData.ExampleLater < MonthDateData.ExampleEarlier);
        Assert.True(MonthDateData.ExampleLater >= MonthDateData.ExampleLater);
        Assert.True(MonthDateData.ExampleEarlier <= MonthDateData.ExampleEarlier);
    }

    [Fact]
    public void ArtimeticOperators_Should_Success()
    {
        // Arrange
        var tempLater = MonthDateData.ExampleLater;
        var tempEarlier = MonthDateData.ExampleEarlier;

        // Assert
        Assert.True(MonthDateData.ExampleLater + MonthDateData.ExampleSummand == MonthDateData.ExampleSum);
        Assert.False(
            MonthDateData.ExampleEarlier - MonthDateData.ExampleSubtrahend == MonthDateData.ExampleDiffrence);
        Assert.True(++tempLater == MonthDateData.ExampleLaterIncrementation);
        Assert.True(--tempEarlier == MonthDateData.ExampleEarlierDecrementation);
    }
}