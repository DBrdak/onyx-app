using Models.Responses;

namespace Identity.Application.Abstractions.IntegrationEvents;

public interface IQueueMessagePublisher
{
    Task<Result> PublishUserRemovedAsync(Guid userId, CancellationToken cancellationToken);
}