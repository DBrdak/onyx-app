using Budget.Domain.Budgets;
using Budget.Domain.Categories;
using Budget.Domain.Tests.Budgets;

namespace Budget.Domain.Tests.Categories;

public sealed class CategoryTests
{
    [Fact]
    public void Create_Should_Success()
    {
        // Act
        var categoryCreateResult = Category.Create(CategoryData.ValidName, new BudgetId());

        // Assert
        Assert.True(categoryCreateResult.IsSuccess);
    }

    [Fact]
    public void Create_Should_Fail_InvalidName()
    {
        // Act
        var categoryCreateResult = Category.Create(CategoryData.InvalidName, new BudgetId());

        // Assert
        Assert.True(categoryCreateResult.IsFailure);
    }

    [Fact]
    public void ChangeName_Should_Success()
    {
        // Arrange
        var exampleCategory = CategoryData.ExampleCategory;

        // Act
        var categoryChangeNameResult = exampleCategory.ChangeName(CategoryData.NewValidName);

        // Assert
        Assert.True(categoryChangeNameResult.IsSuccess);
        Assert.Equal(exampleCategory.Name.Value, CategoryData.NewValidName);
    }

    [Fact]
    public void ChangeName_Should_Fail_InvalidName()
    {
        // Arrange
        var exampleCategory = CategoryData.ExampleCategory;

        // Act
        var categoryChangeNameResult = exampleCategory.ChangeName(CategoryData.InvalidName);

        // Assert
        Assert.True(categoryChangeNameResult.IsFailure);
        Assert.NotEqual(exampleCategory.Name.Value, CategoryData.InvalidName);
    }

    [Fact]
    public void NewSubcategory_Should_Success()
    {
        // Arrange
        var exampleCategory = CategoryData.ExampleCategory;

        // Act
        var newSubcategoryResult = exampleCategory.NewSubcategory(CategoryData.ValidSubcategoryName);

        // Assert
        Assert.True(newSubcategoryResult.IsSuccess);
        Assert.Contains(exampleCategory.SubcategoriesId, x => x == newSubcategoryResult.Value.Id);
    }

    [Fact]
    public void NewSubcategory_Should_Fail_InvalidSubcategoryName()
    {
        // Arrange
        var exampleCategory = CategoryData.ExampleCategory;

        // Act
        var newSubcategoryResult = exampleCategory.NewSubcategory(CategoryData.InvalidSubcategoryName);

        // Assert
        Assert.True(newSubcategoryResult.IsFailure);
        Assert.DoesNotContain(exampleCategory.SubcategoriesId, x => x == newSubcategoryResult.Value.Id);
    }

    [Fact]
    public void RemoveSubcategory_Should_Success()
    {
        // Arrange
        var exampleCategory = CategoryData.ExampleCategory;
        var subcategory = exampleCategory.NewSubcategory(CategoryData.ValidSubcategoryName).Value;

        // Act
        var removeSubcategoryResult = exampleCategory.RemoveSubcategory(subcategory);

        // Assert
        Assert.True(removeSubcategoryResult.IsSuccess);
        Assert.DoesNotContain(exampleCategory.SubcategoriesId, x => x == subcategory.Id);
    }
}