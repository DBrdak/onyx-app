using Models.Responses;

namespace Budget.Application.Budgets.GetBudgetInvitation;

internal sealed class GetBudgetInvitationErrors
{
    public static readonly Error InvalidHost = new (
        "BudgetInvitation.InvalidHost",
        "URL specified in the header is invalid");
}