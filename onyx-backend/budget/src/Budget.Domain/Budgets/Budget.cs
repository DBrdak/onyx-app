using Abstractions.DomainBaseTypes;
using Budget.Domain.Budgets.DomainEvents;
using Budget.Domain.Categories;
using Budget.Domain.Subcategories;
using Models.DataTypes;
using Models.Responses;

namespace Budget.Domain.Budgets;

public sealed class Budget : Entity<BudgetId>
{
    public BudgetName Name { get; private set; }
    public Currency BaseCurrency { get; private set; }
    private readonly List<BudgetMember> _budgetMembers;
    public IReadOnlyCollection<BudgetMember> BudgetMembers => _budgetMembers.AsReadOnly();
    public BudgetInvitationToken? InvitationToken { get; private set; }
    public SubcategoryId? UnknownSubcategoryId { get; private set; }
    private const int maxUsers = 10;
    public int MaxAccounts => 8 + 2 * (_budgetMembers.Count - 1);
    public int MaxCategories => 15 + 5 * (_budgetMembers.Count - 1);

    [Newtonsoft.Json.JsonConstructor]
    [System.Text.Json.Serialization.JsonConstructor]
    private Budget(
        BudgetName name,
        Currency baseCurrency,
        List<BudgetMember> budgetMembers,
        BudgetInvitationToken? invitationToken,
        SubcategoryId? unknownSubcategoryId,
        BudgetId? id = null,
        long? createdAt = null) : base(id ?? new BudgetId(), createdAt)
    {
        Name = name;
        BaseCurrency = baseCurrency;
        InvitationToken = invitationToken;
        UnknownSubcategoryId = unknownSubcategoryId;
        _budgetMembers = budgetMembers;
    }

    public static Result<Budget> Create(string budgetName, string userId, string username, string email, string currencyCode)
    {
        var budgetNameCreateResult = BudgetName.Create(budgetName);

        if (budgetNameCreateResult.IsFailure)
        {
            return budgetNameCreateResult.Error;
        }

        var currencyCreateResult = Currency.FromCode(currencyCode);

        if (currencyCreateResult.IsFailure)
        {
            return currencyCreateResult.Error;
        }

        var budget = new Budget(
            budgetNameCreateResult.Value,
            currencyCreateResult.Value,
            [
                BudgetMember.Create(
                    userId,
                    username,
                    email)
            ],
            null,
            null);

        budget.RaiseDomainEvent(new BudgetCreatedDomainEvent(budget));

        return budget;
    }

    public Result EditBudgetName(string newBudgetName)
    {
        var budgetNameCreateResult = BudgetName.Create(newBudgetName);

        if (budgetNameCreateResult.IsFailure)
        {
            return budgetNameCreateResult.Error;
        }

        var budgetName = budgetNameCreateResult.Value;

        Name = budgetName;

        return Result.Success();
    }

    public Result AddMember(string userId, string username, string email, string token)
    {
        if (_budgetMembers.Count >= maxUsers)
        {
            return Result.Failure(BudgetErrors.MaxUserNumberReached);
        }

        if (_budgetMembers.Any(member => member.Id == userId || member.Email.ToLower() == email.ToLower()))
        {
            return BudgetErrors.UserAlreadyAdded;
        }

        if (InvitationToken is null)
        {
            return BudgetErrors.InvitationTokenNotGenerated;
        }

        var validationResult = InvitationToken.Validate(token);

        if (validationResult.IsFailure)
        {
            return validationResult.Error;
        }

        _budgetMembers.Add(BudgetMember.Create(userId, username, email));

        return Result.Success();
    }

    public Result ExcludeUser(string memberId)
    {
        if (_budgetMembers.Count == 1)
        {
            return BudgetErrors.UserRemoveError;
        }

        var isFound = _budgetMembers.FirstOrDefault(member => member.Id == memberId) is var member &&
                      member is not null &&
                      _budgetMembers.Remove(member);

        if (!isFound)
        {
            return BudgetErrors.UserNotAdded;
        }

        return Result.Success();
    }

    public BudgetInvitationToken GetInvitationToken() => 
        InvitationToken ??= BudgetInvitationToken.Generate();

    public void Setup(Category initialCategory, Subcategory initialSubcategory)
    {
        UnknownSubcategoryId = initialSubcategory.Id;
    }
}