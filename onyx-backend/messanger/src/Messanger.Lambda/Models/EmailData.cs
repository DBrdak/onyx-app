using Amazon.Lambda.SNSEvents;
using Newtonsoft.Json;

namespace Messanger.Lambda.Models;

public sealed record EmailData
{
    [JsonProperty("from")]
    public const string From = "Onyx <notify@onyxapp.tech>";
    private const string toMapName = "Recipient";
    [JsonProperty("to")]
    public string[] To { get; init; }
    private const string subjectMapName = "Subject";
    [JsonProperty("subject")]
    public string Subject { get; init; }
    private const string htmlMapName = "HtmlBody";
    [JsonProperty("html")]
    public string Html { get; init; }
    private const string plainTextBodyMapName = "PlainTextBody";
    [JsonProperty("plainTextBody")]
    public string PlainTextBody { get; init; }

    private EmailData(string[] to, string subject, string html, string plainTextBody)
    {
        To = to;
        Subject = subject;
        Html = html;
        PlainTextBody = plainTextBody;
    }

    public static EmailData FromMessageAttributes(IDictionary<string, SNSEvent.MessageAttribute> messageAttributes)
    {
        return new(
            [messageAttributes[toMapName].Value],
            messageAttributes[subjectMapName].Value,
            messageAttributes[htmlMapName].Value,
            messageAttributes[plainTextBodyMapName].Value);
    }
}