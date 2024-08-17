using Messanger.Lambda.Models;
using Models.Responses;

namespace Messanger.Lambda.Services.Emails;

public sealed class EmailService
{
    private readonly ResendClient.ResendClient _resendClient = new ();

    public async Task<Result> SendAsync(
        EmailData data,
        CancellationToken cancellationToken = default) =>
        await _resendClient.SendEmailAsync(
            data,
            cancellationToken);
}