using Amazon.SimpleNotificationService;
using Amazon.SimpleNotificationService.Model;
using Identity.Domain;
using Identity.Infrastructure.Email.Models;
using Identity.Infrastructure.Messanger;
using Microsoft.Extensions.Configuration;
using Models.Responses;

namespace Identity.Infrastructure.Email;

internal sealed class EmailService : IEmailService
{
    private readonly MessangerClient _messangerClient;
    private readonly IAmazonSimpleNotificationService _snsService;
    private readonly IConfiguration _config;

    public EmailService(MessangerClient messangerClient, IConfiguration config)
    {
        _messangerClient = messangerClient;
        _config = config;
        _snsService = new AmazonSimpleNotificationServiceClient();
    }

    public async Task<Result> SendEmailAsync(string recipient, string subject, string htmlBody)
    {
        var topicArn = await GetSendEmailTopicArnAsync();

        var emailMessageWriteResult = EmailMessage.Write(recipient, subject, htmlBody);

        if (emailMessageWriteResult.IsFailure)
        {
            return emailMessageWriteResult.Error;
        }

        var message = emailMessageWriteResult.Value;

        var data = new Dictionary<string, MessageAttributeValue>
        {
            { nameof(EmailMessage.Recipient), new MessageAttributeValue {DataType = "String", StringValue = message.Recipient.Value} },
            { nameof(EmailMessage.Subject), new MessageAttributeValue {DataType = "String", StringValue = message.Subject.Value} },
            { nameof(EmailMessage.HtmlBody), new MessageAttributeValue {DataType = "String", StringValue = message.HtmlBody.Value} },
        };

        await _messangerClient.Message(topicArn, data);

        return Result.Success();
    }

    public async Task<Result> SendEmailAsync((string recipient, string subject, string htmlBody) request, CancellationToken cancellationToken) =>
        await SendEmailAsync(request.recipient, request.subject, request.htmlBody);

    private async Task<string> GetSendEmailTopicArnAsync() =>
        (await _snsService.FindTopicAsync(_config["sendEmailTopicName"])).TopicArn;
}