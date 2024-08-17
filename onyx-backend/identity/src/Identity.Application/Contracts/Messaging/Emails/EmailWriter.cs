namespace Identity.Application.Contracts.Messaging.Emails;

internal sealed class EmailWriter
{
    private readonly string _recipientEmail;
    private readonly string _username;

    public EmailWriter(string recipientEmail, string username)
    {
        _recipientEmail = recipientEmail;
        _username = username;
    }

    internal (string recipient, string subject, string htmlBody) WriteEmailVerification(string code)
    {
        var (subject, htmlBody) = EmailTemplates.EmailVerificationBodyTemplate(code, _username);

        return (_recipientEmail, subject, htmlBody);
    }

    internal (string recipient, string subject, string htmlBody) WriteForgotPassword(string code)
    {
        var (subject, htmlBody) = EmailTemplates.ForgotPasswordBodyTemplate(code, _username);

        return (_recipientEmail, subject, htmlBody);
    }

    internal (string recipient, string subject, string htmlBody) WriteChangeEmail(string code)
    {
        var (subject, htmlBody) = EmailTemplates.EmailChangeBodyTemplate(code, _username);

        return (_recipientEmail, subject, htmlBody);
    }
}