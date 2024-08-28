using Models.Responses;

namespace Budget.Infrastructure.Queues;

internal static class QueueMessagePublisherErrors
{
    public static readonly Error ConnectionError = new(
        "QueueMessagePublisher.ConnectionFailed",
        "Error occured when trying to establish the connection with SQS service");

    public static readonly Error UnknownError = new(
        "QueueMessagePublisher.Unknown",
        "Unknown error has occured when trying to communicate with SQS service");
}