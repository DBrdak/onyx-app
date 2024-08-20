using Amazon.SQS;
using Amazon.SQS.Model;
using Budget.Application.Abstractions.IntegrationEvents;
using Budget.Domain.Budgets;
using Extensions.Http;
using Microsoft.Extensions.Configuration;
using Models.Responses;
using Newtonsoft.Json;

namespace Budget.Infrastructure.Queues;

internal sealed class QueueMessagePublisher : IQueueMessagePublisher
{
    private readonly IAmazonSQS _sqsClient;
    private readonly IConfiguration _configuration;

    public QueueMessagePublisher(IConfiguration configuration)
    {
        _configuration = configuration;
        _sqsClient = new AmazonSQSClient();
    }

    public async Task<Result> PublishBudgetMemberRemoveAsync(
        string budgetMemberId,
        BudgetId budgetId,
        CancellationToken cancellationToken)
    {
        var queueName = _configuration["queueNames:budgetMemberRemove"] ??
                        throw new ArgumentNullException("BudgetMemberRemove Queue Name");
        var messageBody = new
        {
            UserId = budgetMemberId,
            BudgetId = budgetId.Value.ToString()
        };

        return await PublishMessageAsync(queueName, messageBody, cancellationToken);
    }

    public async Task<Result> PublishBudgetMemberJoinedAsync(
        string newBudgetMemberId,
        BudgetId budgetId,
        CancellationToken cancellationToken)
    {
        var queueName = _configuration["queueNames:budgetMemberJoined"] ??
                        throw new ArgumentNullException("BudgetMemberJoined Queue Name");
        var messageBody = new
        {
            UserId = newBudgetMemberId,
            BudgetId = budgetId.Value.ToString()
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

        if (response.HttpStatusCode.IsSuccessful())
        {
            return QueueMessagePublisherErrors.ConnectionError;
        }

        return Result.Success();
    }

    private async Task<Result<string>> GetQueueAsync(string queueName, CancellationToken cancellationToken)
    {
        var queueGetRespone = await _sqsClient.GetQueueUrlAsync(queueName, cancellationToken);

        if (queueGetRespone.HttpStatusCode.IsSuccessful())
        {
            return QueueMessagePublisherErrors.ConnectionError;
        }

        return queueGetRespone.QueueUrl;
    }
}