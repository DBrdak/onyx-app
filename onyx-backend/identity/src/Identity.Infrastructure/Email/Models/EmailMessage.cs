using Models.Responses;

namespace Identity.Infrastructure.Email.Models;

internal sealed record EmailMessage
{
    public Domain.Email Recipient { get; init; }
    public EmailMessageSubject Subject { get; init; }
    public EmailMessageBody HtmlBody { get; init; }

    private EmailMessage(Domain.Email recipient, EmailMessageSubject subject, EmailMessageBody htmlBody)
    {
        Recipient = recipient;
        Subject = subject;
        HtmlBody = htmlBody;
    }

    public static Result<EmailMessage> Write(string recipient, string subject, string htmlBody)
    {
        var recipientEmailCreateResult = Domain.Email.Create(recipient);

        if (recipientEmailCreateResult.IsFailure)
        {
            return recipientEmailCreateResult.Error;
        }

        var messageSubjectCreateResult = EmailMessageSubject.Create(subject);

        if (messageSubjectCreateResult.IsFailure)
        {
            return messageSubjectCreateResult.Error;
        }

        var htmlBodyCreateResult = EmailMessageBody.CreateHtml(htmlBody);

        if (htmlBodyCreateResult.IsFailure)
        {
            return htmlBodyCreateResult.Error;
        }

        return new EmailMessage(
            recipientEmailCreateResult.Value,
            messageSubjectCreateResult.Value,
            htmlBodyCreateResult.Value);
    }
}