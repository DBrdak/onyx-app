using Budget.Domain.Accounts;

namespace Budget.Domain.Tests.Accounts;

public sealed class AccountTests
{
    [Fact]
    public void Create_Should_Success()
    {
        // Act
        var accountCreateResult = Account.Create(
            AccountData.ValidName,
            AccountData.Balance,
            AccountData.ValidType,
            AccountData.BudgetId);

        // Assert
        Assert.True(accountCreateResult.IsSuccess);
    }

    [Fact]
    public void Create_Should_Fail_InvalidName()
    {
        // Act
        var accountCreateResult = Account.Create(
            AccountData.InvalidName,
            AccountData.Balance,
            AccountData.ValidType,
            AccountData.BudgetId);

        // Assert
        Assert.True(accountCreateResult.IsFailure);
    }

    [Fact]
    public void Create_Should_Fail_InvalidType()
    {
        // Act
        var accountCreateResult = Account.Create(
            AccountData.ValidName,
            AccountData.Balance,
            AccountData.InvalidType,
            AccountData.BudgetId);

        // Assert
        Assert.True(accountCreateResult.IsFailure);
    }

    [Fact]
    public void ChangeName_Should_Success()
    {
        // Act
        var accountChangeNameResult = AccountData.Account.ChangeName(AccountData.NewValidName);

        // Assert
        Assert.True(accountChangeNameResult.IsSuccess);
        Assert.Equal(AccountData.Account.Name.Value, AccountData.NewValidName);
    }

    [Fact]
    public void ChangeName_Should_Fail()
    {
        // Act
        var accountChangeNameResult = AccountData.Account.ChangeName(AccountData.InvalidName);

        // Assert
        Assert.True(accountChangeNameResult.IsFailure);
        Assert.Equal(AccountData.Account.Name.Value, AccountData.ValidName);
    }

    [Fact]
    public void ChangeBalance_Should_Success()
    {
        // Act
        var accountChangeBalanceResult = AccountData.Account.ChangeBalance(AccountData.NewBalance);

        // Assert
        Assert.True(accountChangeBalanceResult.IsSuccess);
        Assert.Equal(AccountData.Account.Balance, AccountData.NewBalance);
    }
}