using Models.Responses;

namespace Identity.Domain;

public interface IEmailService
{
    Task<Result> SendEmailAsync(string recipient, string subject, string htmlBody);

    Task<Result> SendEmailAsync((string recipient, string subject, string htmlBody) request, CancellationToken cancellationToken);
}