using Models.Responses;

namespace Budget.Application.Abstractions.IntegrationEvents;

public interface IEventPublisher
{
    Task<Result> PublishEventAsync(Queue queue, object message, CancellationToken cancellationToken);
}