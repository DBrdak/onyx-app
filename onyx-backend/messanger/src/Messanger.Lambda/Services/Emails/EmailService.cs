using Amazon.SimpleEmail.Model;
using Messanger.Lambda.Models;
using Models.Responses;
using Amazon.SimpleEmail;
using Extensions.Http;

namespace Messanger.Lambda.Services.Emails;

public sealed class EmailService
{
    private static readonly AmazonSimpleEmailServiceClient sesClient = new ();
    private const string sourceEmailAddress = "notify@onyxapp.tech";

    public static async Task<Result> SendAsync(EmailData data, CancellationToken cancellationToken = default)
    {
        var desitnation = new Destination([data.Recipient]);
        var message = new Message(
            new(data.Subject),
            new Body { Html = new(data.HtmlBody) });

        var sendRequest = new SendEmailRequest
        {
            Source = sourceEmailAddress,
            Destination = desitnation,
            Message = message
        };
        
        var response = await sesClient.SendEmailAsync(sendRequest, cancellationToken);

        return response.HttpStatusCode.IsSuccessful() ?
            Result.Success() : 
            Result.Failure(Error.Exception);
    }
}