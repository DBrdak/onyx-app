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

    private const string toMapName = "Recipient";
    private const string subjectMapName = "Subject";
    private const string htmlMapName = "HtmlBody";

    private EmailData(string[] to, string subject, string html)
    {
        From = baseSender;
        To = to;
        Subject = subject;
        Html = html;
    }

    [JsonConstructor]
    private EmailData(string from, string[] to, string subject, string html)
    {
        From = from;
        To = to;
        Subject = subject;
        Html = html;
    }

    public static EmailData FromMessageAttributes(IDictionary<string, SNSEvent.MessageAttribute> messageAttributes)
    {
        return new(
            [messageAttributes[toMapName].Value],
            messageAttributes[subjectMapName].Value,
            messageAttributes[htmlMapName].Value);
    }
}