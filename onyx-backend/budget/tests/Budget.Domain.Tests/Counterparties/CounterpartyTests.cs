using Budget.Domain.Budgets;
using Budget.Domain.Counterparties;

namespace Budget.Domain.Tests.Counterparties;

public sealed class CounterpartyTests
{
    [Fact]
    public void Create_Should_Success()
    {
        // Act
        var counterpartyCreateResult = Counterparty.Create(
            CounterpartyData.ValidName,
            CounterpartyData.ValidTypePayee,
            new BudgetId());

        // Assert
        Assert.True(counterpartyCreateResult.IsSuccess);
    }

    [Fact]
    public void Create_Should_Fail_InvalidName()
    {
        // Act
        var counterpartyCreateResult = Counterparty.Create(
            CounterpartyData.InvalidName,
            CounterpartyData.ValidTypePayee,
            new BudgetId());

        // Assert
        Assert.True(counterpartyCreateResult.IsFailure);
    }

    [Fact]
    public void Create_Should_Fail_InvalidType()
    {
        // Act
        var counterpartyCreateResult = Counterparty.Create(
            CounterpartyData.ValidName,
            CounterpartyData.InvalidType,
            new BudgetId());

        // Assert
        Assert.True(counterpartyCreateResult.IsFailure);
    }

    [Fact]
    public void Create_Should_SetPropertiesCorrectly()
    {
        // Arrange
        var budgetId = new BudgetId();

        // Act
        var counterpartyCreateResult = Counterparty.Create(
            CounterpartyData.ValidName,
            CounterpartyData.ValidTypePayee,
            budgetId);
        var counterparty = counterpartyCreateResult.Value;

        // Assert
        Assert.True(counterpartyCreateResult.IsSuccess);
        Assert.Equal(CounterpartyData.ValidName, counterparty.Name.Value);
        Assert.Equal(CounterpartyData.ValidTypePayee, counterparty.Type.Value);
        Assert.Equal(budgetId, counterparty.BudgetId);
    }

    [Fact]
    public void ChangeName_Should_Success()
    {
        // Arrange
        var exampleCounterparty = CounterpartyData.ExampleCounterparty;

        // Act
        var changeNameResult = exampleCounterparty.ChangeName(CounterpartyData.NewValidName);

        // Assert
        Assert.True(changeNameResult.IsSuccess);
        Assert.Equal(CounterpartyData.NewValidName, exampleCounterparty.Name.Value);
    }

    [Fact]
    public void ChangeName_Should_Fail_InvalidName()
    {
        // Arrange
        var exampleCounterparty = CounterpartyData.ExampleCounterparty;
        var originalName = exampleCounterparty.Name.Value;

        // Act
        var changeNameResult = exampleCounterparty.ChangeName(CounterpartyData.InvalidName);

        // Assert
        Assert.True(changeNameResult.IsFailure);
        Assert.Equal(originalName, exampleCounterparty.Name.Value);
    }
}