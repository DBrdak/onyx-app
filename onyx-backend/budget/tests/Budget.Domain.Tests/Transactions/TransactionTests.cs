using Budget.Domain.Subcategories;
using Budget.Domain.Transactions;

namespace Budget.Domain.Tests.Transactions;

public sealed class TransactionTests
{
    [Fact]
    public void CreatePrincipalOutflow_Should_Success()
    {
        // Arrange
        var transactionFactory = TransactionData.GetTransactionFactory();
        var counterparty = TransactionData.ExamplePayee;
        var subcategory = TransactionData.ExampleSubcategory;
        var amount = TransactionData.ValidAmount;
        var transactedAt = TransactionData.ValidTransactedAt;

        // Act
        var transactionCreateResult = transactionFactory.CreateTransaction(
            counterparty,
            subcategory,
            transactedAt,
            amount,
            null,
            null
        );

        // Assert
        Assert.True(transactionCreateResult.IsSuccess);
        var transaction = transactionCreateResult.Value;
        Assert.Equal(amount, transaction.Amount);
        Assert.Equal(counterparty.Id, transaction.CounterpartyId);
        Assert.Equal(subcategory.Id, transaction.SubcategoryId);
    }

    [Fact]
    public void CreatePrincipalOutflow_Should_Fail_InvalidCounterpartyType()
    {
        // Arrange
        var transactionFactory = TransactionData.GetTransactionFactory();
        var counterparty = TransactionData.ExamplePayer;
        var subcategory = TransactionData.ExampleSubcategory;
        var amount = TransactionData.ValidAmount;
        var transactedAt = TransactionData.ValidTransactedAt;

        // Act
        var transactionCreateResult = transactionFactory.CreateTransaction(
            counterparty,
            subcategory,
            transactedAt,
            amount,
            null,
            null
        );

        // Assert
        Assert.True(transactionCreateResult.IsFailure);
    }

    [Fact]
    public void CreatePrincipalInflow_Should_Success()
    {
        // Arrange
        var transactionFactory = TransactionData.GetTransactionFactory();
        var counterparty = TransactionData.ExamplePayer;
        var amount = TransactionData.ValidInflowAmount;
        var transactedAt = TransactionData.ValidTransactedAt;

        // Act
        var transactionCreateResult = transactionFactory.CreateTransaction(
            counterparty,
            null,
            transactedAt,
            amount,
            null,
            null
        );

        // Assert
        Assert.True(transactionCreateResult.IsSuccess);
        var transaction = transactionCreateResult.Value;
        Assert.Equal(amount, transaction.Amount);
        Assert.Equal(counterparty.Id, transaction.CounterpartyId);
        Assert.Null(transaction.SubcategoryId);
    }

    [Fact]
    public void CreatePrincipalInflow_Should_Fail_InvalidCounterpartyType()
    {
        // Arrange
        var transactionFactory = TransactionData.GetTransactionFactory();
        var counterparty = TransactionData.ExamplePayee;
        var amount = TransactionData.ValidInflowAmount;
        var transactedAt = TransactionData.ValidTransactedAt;

        // Act
        var transactionCreateResult = transactionFactory.CreateTransaction(
            counterparty,
            null,
            transactedAt,
            amount,
            null,
            null
        );

        // Assert
        Assert.True(transactionCreateResult.IsFailure);
    }

    [Fact]
    public void CreateForeignOutflow_Should_Success()
    {
        // Arrange
        var transactionFactory = TransactionData.GetTransactionFactory();
        var counterparty = TransactionData.ExamplePayee;
        var subcategory = TransactionData.ExampleSubcategory;
        var originalAmount = TransactionData.ValidOriginalAmount;
        var convertedAmount = TransactionData.ValidConvertedAmount;
        var transactedAt = TransactionData.ValidTransactedAt;

        // Act
        var transactionCreateResult = transactionFactory.CreateTransaction(
            counterparty,
            subcategory,
            transactedAt,
            originalAmount,
            convertedAmount,
            null
        );

        // Assert
        Assert.True(transactionCreateResult.IsSuccess);
        var transaction = transactionCreateResult.Value;
        Assert.Equal(convertedAmount, transaction.Amount);
        Assert.Equal(originalAmount, transaction.OriginalAmount);
        Assert.Equal(counterparty.Id, transaction.CounterpartyId);
        Assert.Equal(subcategory.Id, transaction.SubcategoryId);
    }

    [Fact]
    public void CreateForeignOutflow_Should_Fail_InvalidCounterpartyType()
    {
        // Arrange
        var transactionFactory = TransactionData.GetTransactionFactory();
        var counterparty = TransactionData.ExamplePayer;
        var subcategory = TransactionData.ExampleSubcategory;
        var originalAmount = TransactionData.ValidOriginalAmount;
        var convertedAmount = TransactionData.ValidConvertedAmount;
        var transactedAt = TransactionData.ValidTransactedAt;

        // Act
        var transactionCreateResult = transactionFactory.CreateTransaction(
            counterparty,
            subcategory,
            transactedAt,
            originalAmount,
            convertedAmount,
            null
        );

        // Assert
        Assert.True(transactionCreateResult.IsFailure);
    }

    [Fact]
    public void CreateForeignInflow_Should_Success()
    {
        // Arrange
        var transactionFactory = TransactionData.GetTransactionFactory();
        var counterparty = TransactionData.ExamplePayer;
        var originalAmount = TransactionData.ValidOriginalAmount with { Amount = Math.Abs(TransactionData.ValidOriginalAmount.Amount) }; // Positive amount
        var convertedAmount = TransactionData.ValidConvertedAmount with { Amount = Math.Abs(TransactionData.ValidConvertedAmount.Amount) }; // Positive amount
        var transactedAt = TransactionData.ValidTransactedAt;

        // Act
        var transactionCreateResult = transactionFactory.CreateTransaction(
            counterparty,
            null,
            transactedAt,
            originalAmount,
            convertedAmount,
            null
        );

        // Assert
        Assert.True(transactionCreateResult.IsSuccess);
        var transaction = transactionCreateResult.Value;
        Assert.Equal(convertedAmount, transaction.Amount);
        Assert.Equal(originalAmount, transaction.OriginalAmount);
        Assert.Equal(counterparty.Id, transaction.CounterpartyId);
        Assert.Null(transaction.SubcategoryId);
    }

    [Fact]
    public void CreateForeignInflow_Should_Fail_InvalidCounterpartyType()
    {
        // Arrange
        var transactionFactory = TransactionData.GetTransactionFactory();
        var counterparty = TransactionData.ExamplePayee; // Payee instead of Payer
        var originalAmount = TransactionData.ValidOriginalAmount with { Amount = Math.Abs(TransactionData.ValidOriginalAmount.Amount) }; // Positive amount
        var convertedAmount = TransactionData.ValidConvertedAmount with { Amount = Math.Abs(TransactionData.ValidConvertedAmount.Amount) }; // Positive amount
        var transactedAt = TransactionData.ValidTransactedAt;

        // Act
        var transactionCreateResult = transactionFactory.CreateTransaction(
            counterparty,
            null,
            transactedAt,
            originalAmount,
            convertedAmount,
            null
        );

        // Assert
        Assert.True(transactionCreateResult.IsFailure);
    }

    [Fact]
    public void CreateTransaction_Should_Fail_FutureDate()
    {
        // Arrange
        var transactionFactory = TransactionData.GetTransactionFactory();
        var counterparty = TransactionData.ExamplePayee;
        var subcategory = TransactionData.ExampleSubcategory;
        var amount = TransactionData.ValidAmount;
        var transactedAt = TransactionData.FutureTransactedAt;

        // Act
        var transactionCreateResult = transactionFactory.CreateTransaction(
            counterparty,
            subcategory,
            transactedAt,
            amount,
            null,
            null
        );

        // Assert
        Assert.True(transactionCreateResult.IsFailure);
    }

    [Fact]
    public void CreateTransaction_Should_Fail_InvalidPastDate()
    {
        // Arrange
        var transactionFactory = TransactionData.GetTransactionFactory();
        var counterparty = TransactionData.ExamplePayee;
        var subcategory = TransactionData.ExampleSubcategory;
        var amount = TransactionData.ValidAmount;
        var transactedAt = TransactionData.InvalidPastDate;

        // Act
        var transactionCreateResult = transactionFactory.CreateTransaction(
            counterparty,
            subcategory,
            transactedAt,
            amount,
            null,
            null
        );

        // Assert
        Assert.True(transactionCreateResult.IsFailure);
    }

    [Fact]
    public void RemoveCounterparty_Should_Success()
    {
        // Arrange
        var transactionFactory = TransactionData.GetTransactionFactory();
        var counterparty = TransactionData.ExamplePayee;
        var subcategory = TransactionData.ExampleSubcategory;
        var amount = TransactionData.ValidAmount;
        var transactedAt = TransactionData.ValidTransactedAt;

        var transactionCreateResult = transactionFactory.CreateTransaction(
            counterparty,
            subcategory,
            transactedAt,
            amount,
            null,
            null
        );

        var transaction = transactionCreateResult.Value;

        // Act
        var removeCounterpartyResult = transaction.RemoveCounterparty();

        // Assert
        Assert.True(removeCounterpartyResult.IsSuccess);
        Assert.Null(transaction.CounterpartyId);
    }

    [Fact]
    public void RemoveSubcategory_Should_Success()
    {
        // Arrange
        var transactionFactory = TransactionData.GetTransactionFactory();
        var counterparty = TransactionData.ExamplePayee;
        var subcategory = TransactionData.ExampleSubcategory;
        var amount = TransactionData.ValidAmount;
        var transactedAt = TransactionData.ValidTransactedAt;
        var unknownSubcategory = TransactionData.UnknownSubcategory;

        var transactionCreateResult = transactionFactory.CreateTransaction(
            counterparty,
            subcategory,
            transactedAt,
            amount,
            null,
            null 
        );

        var transaction = transactionCreateResult.Value;

        // Act
        var removeSubcategoryResult = transaction.RemoveSubcategory(unknownSubcategory);

        // Assert
        Assert.True(removeSubcategoryResult.IsSuccess);
        Assert.Equal(unknownSubcategory.Id, transaction.SubcategoryId);
    }

    [Fact]
    public void TransactionService_RemoveTransaction_Should_Success()
    {
        // Arrange
        var transactionFactory = TransactionData.GetTransactionFactory();
        var counterparty = TransactionData.ExamplePayee;
        var subcategory = TransactionData.ExampleSubcategory;
        var amount = TransactionData.ValidAmount;
        var transactedAt = TransactionData.ValidTransactedAt;
        var account = TransactionData.ExampleAccount;

        var transactionCreateResult = transactionFactory.CreateTransaction(
            counterparty,
            subcategory,
            transactedAt,
            amount,
            null,
            null 
        );

        var transaction = transactionCreateResult.Value;

        // Act
        var removeTransactionResult = TransactionService.RemoveTransaction(
            transaction,
            account,
            subcategory
        );

        // Assert
        Assert.True(removeTransactionResult.IsSuccess);
    }

    [Fact]
    public void TransactionService_SetSubcategory_Should_Success()
    {
        // Arrange
        var transactionFactory = TransactionData.GetTransactionFactory();
        var counterparty = TransactionData.ExamplePayee;
        var amount = TransactionData.ValidAmount;
        var transactedAt = TransactionData.ValidTransactedAt;
        var unknownSubcategory = TransactionData.UnknownSubcategory;
        var newSubcategory = TransactionData.ExampleSubcategory;

        var transactionCreateResult = transactionFactory.CreateTransaction(
            counterparty,
            newSubcategory,
            transactedAt,
            amount,
            null,
            amount 
        );

        var transaction = transactionCreateResult.Value;

        // Act
        var setSubcategoryResult = TransactionService.SetSubcategory(
            transaction,
            newSubcategory,
            unknownSubcategory
        );

        // Assert
        Assert.True(setSubcategoryResult.IsSuccess);
        Assert.Equal(newSubcategory.Id, transaction.SubcategoryId);
    }
}