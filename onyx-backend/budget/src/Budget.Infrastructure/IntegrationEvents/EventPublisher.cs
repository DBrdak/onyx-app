using Amazon.SQS;
using Amazon.SQS.Model;
using Budget.Application.Abstractions.IntegrationEvents;
using Extensions.Http;
using Models.Responses;
using Newtonsoft.Json;

namespace Budget.Infrastructure.IntegrationEvents;

internal sealed class EventPublisher : IEventPublisher
{
    private readonly IAmazonSQS _sqsClient;

    public EventPublisher()
    {
        _sqsClient = new AmazonSQSClient();
    }

    public async Task<Result> PublishEventAsync(Queue queue, object message, CancellationToken cancellationToken)
    {
        var queueUrlGetResult = await GetQueueAsync(queue.Name, cancellationToken);

        if (queueUrlGetResult.IsFailure)
        {
            return queueUrlGetResult.Error;
        }

        var queueUrl = queueUrlGetResult.Value;

        var messageJson = JsonConvert.SerializeObject(message);

        var response = await _sqsClient.SendMessageAsync(queueUrl, messageJson, cancellationToken);

        if (response.HttpStatusCode.IsSuccessful())
        {
            return EventPublisherErrors.ConnectionError;
        }

        return Result.Success();
    }

    private async Task<Result<string>> GetQueueAsync(string queueName, CancellationToken cancellationToken)
    {
        try
        {
            var queueGetRespone = await _sqsClient.GetQueueUrlAsync(queueName, cancellationToken);

            if (queueGetRespone.HttpStatusCode.IsSuccessful())
            {
                return EventPublisherErrors.ConnectionError;
            }

            return queueGetRespone.QueueUrl;
        }
        catch (QueueDoesNotExistException)
        {
            return await CreateQueue(queueName, cancellationToken);
        }
    }

    private async Task<Result<string>> CreateQueue(string queueName, CancellationToken cancellationToken)
    {
        var createQueueResponse = await _sqsClient.CreateQueueAsync(
            new CreateQueueRequest { QueueName = queueName}, cancellationToken);

        if (createQueueResponse.HttpStatusCode.IsSuccessful())
        {
            return EventPublisherErrors.ConnectionError;
        }

        return createQueueResponse.QueueUrl;
    }
}