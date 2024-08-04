using Models.Responses;

namespace Budget.Infrastructure.IntegrationEvents;

internal static class EventPublisherErrors
{
    public static readonly Error ConnectionError = new(
        "EventPublisher.ConnectionFailed",
        "Error occured when trying to establish the connection with SQS service");

    public static readonly Error UnknownError = new(
        "EventPublisher.Unknown",
        "Unknown error has occured when trying to communicate with SQS service");
}