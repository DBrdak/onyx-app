using Models.Responses;

namespace Identity.Application.Auth.GoogleLogin;

internal sealed record GoogleLoginErrors
{
    public static Error InvalidHost => new (
        "BudgetInvitation.InvalidHost",
        "URL specified in the header is invalid");
}