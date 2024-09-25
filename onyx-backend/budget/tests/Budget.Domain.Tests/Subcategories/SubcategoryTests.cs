using Budget.Domain.Subcategories;
using Models.DataTypes;

namespace Budget.Domain.Tests.Subcategories;

public sealed class SubcategoryTests
{
    [Fact]
    public void Create_Should_Success()
    {
        // Act
        var subcategoryCreateResult = SubcategoryData.ExampleCategory.NewSubcategory(SubcategoryData.ValidName);

        // Assert
        Assert.True(subcategoryCreateResult.IsSuccess);
    }

    [Fact]
    public void Create_Should_Fail_InvalidName()
    {
        // Act
        var subcategoryCreateResult = SubcategoryData.ExampleCategory.NewSubcategory(SubcategoryData.InvalidName);

        // Assert
        Assert.True(subcategoryCreateResult.IsFailure);
    }

    [Fact]
    public void ChangeName_Should_Success()
    {
        // Arrange
        var exampleSubcategory = SubcategoryData.ExampleSubcategory;

        // Act
        var changeNameResult = SubcategoryService.UpdateSubcategory(exampleSubcategory, SubcategoryData.NewValidName, null);

        // Assert
        Assert.True(changeNameResult.IsSuccess);
        Assert.Equal(SubcategoryData.NewValidName, exampleSubcategory.Name.Value);
    }

    [Fact]
    public void ChangeName_Should_Fail_InvalidName()
    {
        // Arrange
        var exampleSubcategory = SubcategoryData.ExampleSubcategory;
        var originalName = exampleSubcategory.Name.Value;

        // Act
        var changeNameResult = SubcategoryService.UpdateSubcategory(exampleSubcategory, SubcategoryData.InvalidName, null);

        // Assert
        Assert.True(changeNameResult.IsFailure);
        Assert.Equal(originalName, exampleSubcategory.Name.Value);
    }

    [Fact]
    public void ChangeDescription_Should_Success()
    {
        // Arrange
        var exampleSubcategory = SubcategoryData.ExampleSubcategory;

        // Act
        var changeDescriptionResult = SubcategoryService.UpdateSubcategory(exampleSubcategory, null, SubcategoryData.ValidDescription);

        // Assert
        Assert.True(changeDescriptionResult.IsSuccess);
        Assert.Equal(SubcategoryData.ValidDescription, exampleSubcategory.Description?.Value);
    }

    [Fact]
    public void ChangeDescription_Should_Fail_InvalidDescription()
    {
        // Arrange
        var exampleSubcategory = SubcategoryData.ExampleSubcategory;
        var originalDescription = exampleSubcategory.Description;

        // Act
        var changeDescriptionResult = SubcategoryService.UpdateSubcategory(exampleSubcategory, null, SubcategoryData.InvalidDescription);

        // Assert
        Assert.True(changeDescriptionResult.IsFailure);
        Assert.Equal(originalDescription, exampleSubcategory.Description);
    }

    [Fact]
    public void Assign_Should_Success()
    {
        // Arrange
        var exampleSubcategory = SubcategoryData.ExampleSubcategory;
        var amount = SubcategoryData.ValidAssignmentAmount;
        var monthDate = SubcategoryData.ValidMonthDate;

        // Act
        var assignResult = SubcategoryService.UpdateAssignment(
            exampleSubcategory,
            monthDate,
            amount);

        // Assert
        Assert.True(assignResult.IsSuccess);
        Assert.Contains(exampleSubcategory.Assignments, a => a == assignResult.Value);
    }

    [Fact]
    public void Assign_Should_Fail_InvalidAmount()
    {
        // Arrange
        var exampleSubcategory = SubcategoryData.ExampleSubcategory;
        var amount = SubcategoryData.InvalidAssignmentAmount;
        var monthDate = SubcategoryData.ValidMonthDate;

        // Act
        var assignResult = SubcategoryService.UpdateAssignment(
            exampleSubcategory,
            monthDate,
            amount);

        // Assert
        Assert.True(assignResult.IsFailure);
    }

    [Fact]
    public void Reassign_Should_Success()
    {
        // Arrange
        var exampleSubcategory = SubcategoryData.ExampleSubcategory;
        var amount = SubcategoryData.ValidAssignmentAmount;
        var newAmount = amount + 50;
        var monthDate = SubcategoryData.ValidMonthDate;

        // First assign
        SubcategoryService.UpdateAssignment(
            exampleSubcategory,
            monthDate,
            amount);

        // Act
        var reassignResult = SubcategoryService.UpdateAssignment(
            exampleSubcategory,
            monthDate,
            newAmount);

        // Assert
        Assert.True(reassignResult.IsSuccess);
        var assignment = exampleSubcategory.GetAssignmentForMonth(
            MonthDate.Create(SubcategoryData.ValidMonth, SubcategoryData.ValidYear).Value);
        Assert.Equal(newAmount, assignment?.AssignedAmount);
    }

    [Fact]
    public void SetTarget_Should_Success()
    {
        // Arrange
        var exampleSubcategory = SubcategoryData.ExampleSubcategory;
        var targetAmount = SubcategoryData.ValidTargetAmount;
        var startedAt = SubcategoryData.ValidMonthDate;
        var upToMonth = SubcategoryData.FutureMonthDate;

        // Act
        var setTargetResult = exampleSubcategory.SetTarget(targetAmount, startedAt, upToMonth);

        // Assert
        Assert.True(setTargetResult.IsSuccess);
        Assert.Equal(targetAmount, exampleSubcategory.Target?.TargetAmount);
    }

    [Fact]
    public void SetTarget_Should_Fail_TargetAlreadySet()
    {
        // Arrange
        var exampleSubcategory = SubcategoryData.ExampleSubcategory;
        var targetAmount = SubcategoryData.ValidTargetAmount;
        var startedAt = SubcategoryData.ValidMonthDate;
        var upToMonth = SubcategoryData.FutureMonthDate;

        // First set target
        exampleSubcategory.SetTarget(targetAmount, startedAt, upToMonth);

        // Act
        var setTargetResult = exampleSubcategory.SetTarget(targetAmount, startedAt, upToMonth);

        // Assert
        Assert.True(setTargetResult.IsFailure);
    }

    [Fact]
    public void UnsetTarget_Should_Success()
    {
        // Arrange
        var exampleSubcategory = SubcategoryData.ExampleSubcategory;
        var targetAmount = SubcategoryData.ValidTargetAmount;
        var startedAt = SubcategoryData.ValidMonthDate;
        var upToMonth = SubcategoryData.FutureMonthDate;

        // First set target
        exampleSubcategory.SetTarget(targetAmount, startedAt, upToMonth);

        // Act
        var unsetResult = exampleSubcategory.UnsetTarget();

        // Assert
        Assert.True(unsetResult.IsSuccess);
        Assert.Null(exampleSubcategory.Target);
    }

    [Fact]
    public void UnsetTarget_Should_Fail_TargetNotSet()
    {
        // Arrange
        var exampleSubcategory = SubcategoryData.ExampleSubcategory;

        // Act
        var unsetResult = exampleSubcategory.UnsetTarget();

        // Assert
        Assert.True(unsetResult.IsFailure);
    }

    // Additional tests for Transact, RemoveTransaction, etc., can be added as needed.
}
