using Budget.Domain.Budgets.DomainEvents;

namespace Budget.Domain.Tests.Budgets;

public sealed class BudgetTests
{
    [Fact]
    public void Create_Should_Success()
    {
        // Act
        var budgetCreateResult = Domain.Budgets.Budget.Create(
            BudgetData.ValidName,
            BudgetData.UserId,
            BudgetData.Username,
            BudgetData.Email,
            BudgetData.CurrencyCode);

        // Assert
        Assert.True(budgetCreateResult.IsSuccess);
    }

    [Fact]
    public void Create_Should_Fail_InvalidName()
    {
        // Act
        var budgetCreateResult = Domain.Budgets.Budget.Create(
            BudgetData.InvalidName,
            BudgetData.UserId,
            BudgetData.Username,
            BudgetData.Email,
            BudgetData.CurrencyCode);

        // Assert
        Assert.True(budgetCreateResult.IsFailure);
    }

    [Fact]
    public void Create_Should_Raise_BudgetCreatedDomainEvent()
    {
        // Act
        var budgetCreateResult = Domain.Budgets.Budget.Create(
            BudgetData.ValidName,
            BudgetData.UserId,
            BudgetData.Username,
            BudgetData.Email,
            BudgetData.CurrencyCode);

        // Assert
        Assert.NotEmpty(budgetCreateResult.Value.GetDomainEvents());
        Assert.Single(budgetCreateResult.Value.GetDomainEvents(), e => e is BudgetCreatedDomainEvent);
    }

    [Fact]
    public void EditName_Should_Success()
    {
        // Act
        var budgetEditNameResult = BudgetData.Budget.EditBudgetName(BudgetData.NewValidName);

        // Assert
        Assert.True(budgetEditNameResult.IsSuccess);
        Assert.Equal(BudgetData.Budget.Name.Value, BudgetData.NewValidName);
    }

    [Fact]
    public void EditName_Should_Fail()
    {
        // Act
        var budgetEditNameResult = BudgetData.Budget.EditBudgetName(BudgetData.InvalidName);

        // Assert
        Assert.True(budgetEditNameResult.IsFailure);
        Assert.Equal(BudgetData.Budget.Name.Value, BudgetData.NewValidName);
    }

    [Fact]
    public void AddMember_Should_Success()
    {
        // Act
        var invitationToken = BudgetData.Budget.GetInvitationToken();
        var budgetAddMemberResult = BudgetData.Budget.AddMember(
            BudgetData.NewUserId,
            BudgetData.NewUsername,
            BudgetData.NewEmail,
            invitationToken.Value);

        // Assert
        Assert.True(budgetAddMemberResult.IsSuccess);
        Assert.Single(
            BudgetData.Budget.BudgetMembers,
            member => member.Id == BudgetData.NewUserId &&
                      member.Username == BudgetData.NewUsername &&
                      member.Email == BudgetData.NewEmail);
    }

    [Fact]
    public void AddMember_Should_Fail_TokenNotGenerated()
    {
        // Act
        var budgetAddMemberResult = BudgetData.BudgetCopy.AddMember(
            BudgetData.NewUserId,
            BudgetData.NewUsername,
            BudgetData.NewEmail,
            BudgetData.InvalidInvitationToken);

        // Assert
        Assert.True(budgetAddMemberResult.IsFailure);
        Assert.Single(BudgetData.BudgetCopy.BudgetMembers);
    }

    [Fact]
    public void AddMember_Should_Fail_InvalidToken()
    {
        // Act
        var invitationToken = BudgetData.BudgetCopy.GetInvitationToken();
        var budgetAddMemberResult = BudgetData.BudgetCopy.AddMember(
            BudgetData.NewUserId,
            BudgetData.NewUsername,
            BudgetData.NewEmail,
            BudgetData.InvalidInvitationToken);

        // Assert
        Assert.True(budgetAddMemberResult.IsFailure);
        Assert.Single(BudgetData.BudgetCopy.BudgetMembers);
    }

    [Fact]
    public void AddMember_Should_Fail_SameUserId()
    {
        // Act
        var invitationToken = BudgetData.BudgetCopy.GetInvitationToken();
        var budgetAddMemberResult = BudgetData.BudgetCopy.AddMember(
            BudgetData.UserId,
            BudgetData.NewUsername,
            BudgetData.NewEmail,
            invitationToken.Value);

        // Assert
        Assert.True(budgetAddMemberResult.IsFailure);
        Assert.Single(BudgetData.BudgetCopy.BudgetMembers);
    }

    [Fact]
    public void AddMember_Should_Fail_SameEmail()
    {
        // Act
        var invitationToken = BudgetData.BudgetCopy.GetInvitationToken();
        var budgetAddMemberResult = BudgetData.BudgetCopy.AddMember(
            BudgetData.NewUserId,
            BudgetData.NewUsername,
            BudgetData.Email,
            invitationToken.Value);

        // Assert
        Assert.True(budgetAddMemberResult.IsFailure);
        Assert.Single(BudgetData.BudgetCopy.BudgetMembers);
    }
}