using Amazon.S3;
using Amazon.SQS;
using Azure;
using Extensions.Http;
using Identity.Application.Abstractions.IntegrationEvents;
using Microsoft.Extensions.Configuration;
using Models.Responses;
using Newtonsoft.Json;

namespace Identity.Infrastructure.Queues;

internal class QueueMessagePublisher : IQueueMessagePublisher
{
    private readonly IAmazonSQS _sqsClient;
    private readonly IConfiguration _configuration;

    public QueueMessagePublisher(IConfiguration configuration)
    {
        _configuration = configuration;
        _sqsClient = new AmazonSQSClient();
    }

    public async Task<Result> PublishUserRemovedAsync(Guid userId, CancellationToken cancellationToken)
    {
        var queueName = _configuration["queueNames:userRemove"] ??
                        throw new ArgumentNullException("UserRemove Queue Name");

        var messageBody = new
        {
            UserId = userId
        };

        return await PublishMessageAsync(queueName, messageBody, cancellationToken);
    }

    private async Task<Result> PublishMessageAsync(string queueName, object message, CancellationToken cancellationToken)
    {
        var getQueueUrlResult = await GetQueueAsync(queueName, cancellationToken);

        if (getQueueUrlResult.IsFailure)
        {
            return getQueueUrlResult.Error;
        }

        var queueUrl = getQueueUrlResult.Value;
        var messageJson = JsonConvert.SerializeObject(message);

        var response = await _sqsClient.SendMessageAsync(queueUrl, messageJson, cancellationToken);

        return !response.HttpStatusCode.IsSuccessful() ?
            QueueMessagePublisherErrors.ConnectionError :
            Result.Success();
    }

    private async Task<Result<string>> GetQueueAsync(string queueName, CancellationToken cancellationToken)
    {
        var queueGetRespone = await _sqsClient.GetQueueUrlAsync(queueName, cancellationToken);

        return !queueGetRespone.HttpStatusCode.IsSuccessful() ?
            QueueMessagePublisherErrors.ConnectionError :
            queueGetRespone.QueueUrl;
    }
}