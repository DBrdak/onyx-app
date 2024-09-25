using System.Text;
using Models.Responses;

namespace Budget.Domain.Budgets;

public sealed record BudgetInvitationToken
{
    public string Value { get; init; }
    public DateTime ExpirationDate { get; init; }
    private const int expirationTimeInMinutes = 60 * 24 * 7; // One Week

    private BudgetInvitationToken(string value, DateTime expirationDate)
    {
        Value = value;
        ExpirationDate = expirationDate;
    }

    internal static BudgetInvitationToken Generate(BudgetId budgetId)
    {
        var bytes = Encoding.UTF8.GetBytes(budgetId.Value.ToString());
        var token = Convert.ToBase64String(bytes);

        return new(token, DateTime.UtcNow.AddMinutes(expirationTimeInMinutes));
    }

    public static Result<BudgetId> GetBudgetIdFromToken(string token)
    {
        try
        {
            var bytes = Convert.FromBase64String(token);

            return new BudgetId(Encoding.UTF8.GetString(bytes));
        }
        catch
        {
            return BudgetErrors.InvalidInvitationToken;
        }
    }

    internal Result Validate(string token)
    {
        if (ExpirationDate < DateTime.UtcNow)
        {
            return BudgetErrors.TokenExpired;
        }

        var isValid = string.Equals(Value, token, StringComparison.CurrentCultureIgnoreCase);

        return isValid ? 
            Result.Success() : 
            BudgetErrors.InvalidToken;
    }
}