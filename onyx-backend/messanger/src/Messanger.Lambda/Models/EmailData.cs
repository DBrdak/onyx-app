using System.Text.Json.Serialization;
using Amazon.Lambda.SNSEvents;

namespace Messanger.Lambda.Models;

public sealed record EmailData
{
    private const string baseSender = "Onyx <notify@onyxapp.tech>";

    [JsonPropertyName("from")]
    public string From { get; init; }
    [JsonPropertyName("to")]
    public string[] To { get; init; }
    [JsonPropertyName("subject")]
    public string Subject { get; init; }
    [JsonPropertyName("html")]
    public string Html { get; init; }
    [JsonIgnore]
    public string PlainTextBody { get; init; }

    private const string toMapName = "Recipient";
    private const string subjectMapName = "Subject";
    private const string htmlMapName = "HtmlBody";
    private const string plainTextBodyMapName = "PlainTextBody";

    private EmailData(string[] to, string subject, string html, string plainTextBody)
    {
        From = baseSender;
        To = to;
        Subject = subject;
        Html = html;
        PlainTextBody = plainTextBody;
    }

    [JsonConstructor]
    private EmailData(string from, string[] to, string subject, string html, string plainTextBody)
    {
        From = from;
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