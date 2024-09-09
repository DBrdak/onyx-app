using Abstractions.Messaging;
using Models.Responses;

namespace Budget.Application.Budgets.PurgeUserData;

internal sealed class PurgeUserDataCommandHandler : ICommandHandler<PurgeUserDataCommand>
{
    public async Task<Result> Handle(PurgeUserDataCommand request, CancellationToken cancellationToken)
    {
        return Result.Success();
    }
}
