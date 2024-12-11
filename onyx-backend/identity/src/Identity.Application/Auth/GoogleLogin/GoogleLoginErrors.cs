using Models.Responses;

namespace Identity.Application.Auth.GoogleLogin;

internal sealed record GoogleLoginErrors
{
    public static Error InvalidHost => new (
        "Google.InvalidOrigin",
        "Origin URL specified in the header is invalid");
}