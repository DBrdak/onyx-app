using Budget.Domain.Counterparties;
using Budget.Domain.Subcategories;
using Models.Primitives;
using Models.Responses;

namespace Budget.Application.Accounts.BulkAddTransactions;

internal sealed record TransactionCreateModel
{
    public Counterparty Counterparty { get; init; }
    public Subcategory? Subcategory { get; init; }
    public DateTime TransactedAt { get; init; }
    public Money OriginalAmount { get; init; }
    public Money? ConvertedAmount { get; init; }
    public Money? BudgetAmount { get; init; }

    private static readonly Error _invalidCollectionProvidedError = new(
        "TransactionCreateModel.InvalidCollection",
        "Cannot create transactions from not equal parameters count");

    public TransactionCreateModel(
        Counterparty Counterparty,
        Subcategory? Subcategory,
        DateTime TransactedAt,
        Money OriginalAmount,
        Money? ConvertedAmount,
        Money? BudgetAmount)
    {
        this.Counterparty = Counterparty;
        this.Subcategory = Subcategory;
        this.TransactedAt = TransactedAt;
        this.OriginalAmount = OriginalAmount;
        this.ConvertedAmount = ConvertedAmount;
        this.BudgetAmount = BudgetAmount;
    }

    public static Result<TransactionCreateModel[]> CreateManyFromArray(
        List<Counterparty> counterparties,
        List<Subcategory?> subcategories,
        List<DateTime> transactedAts,
        List<Money> originalAmounts,
        List<Money?> convertedAmounts,
        List<Money?> budgetAmounts)
    {
        if (counterparties.Count != subcategories.Count ||
            subcategories.Count != transactedAts.Count ||
            transactedAts.Count != originalAmounts.Count ||
            originalAmounts.Count != convertedAmounts.Count ||
            convertedAmounts.Count != budgetAmounts.Count)
        {
            return _invalidCollectionProvidedError;
        }

        var generalCount = counterparties.Count;
        var models = new TransactionCreateModel[generalCount];

        for (int i = 0; i < models.Length; i++)
        {
            models[i] = new TransactionCreateModel(
                counterparties[i],
                subcategories[i],
                transactedAts[i],
                originalAmounts[i],
                convertedAmounts[i],
                budgetAmounts[i]);
        }

        return models;
    }
}