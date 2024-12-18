using Abstractions.Messaging;
using Budget.Application.Budgets.Models;
using Budget.Domain.Budgets;
using Extensions;
using Models.Responses;

namespace Budget.Application.Budgets.GetBudgetInvitation;

internal sealed class GetBudgetInvitationQueryHandler : IQueryHandler<GetBudgetInvitationQuery, InvitationUrl>
{
    private readonly IBudgetRepository _budgetRepository;

    private string GetInvitationRelativePath(string token) =>
        $"/budgets/join?token={token}";

    public GetBudgetInvitationQueryHandler(IBudgetRepository budgetRepository)
    {
        _budgetRepository = budgetRepository;
    }

    public async Task<Result<InvitationUrl>> Handle(GetBudgetInvitationQuery request, CancellationToken cancellationToken)
    {
        var clientUrl = request.BaseUrl;

        if (string.IsNullOrWhiteSpace(clientUrl) || !Uri.TryCreate(clientUrl, UriKind.Absolute, out _))
        {
            return GetBudgetInvitationErrors.InvalidHost;
        }

        if (clientUrl.EndsWith("/"))
        {
            clientUrl = clientUrl[..^1];
        }

        var getBudgetResult = await _budgetRepository.GetByIdAsync(new BudgetId(request.BudgetId), cancellationToken);

        if (getBudgetResult.IsFailure)
        {
            return getBudgetResult.Error;
        }

        var budget = getBudgetResult.Value;

        var token = budget.GetInvitationToken();
        var tokenValidForTimeSpan = token.ExpirationDate - DateTime.UtcNow;
        var tokenValidForSeconds = Convert.ToInt32(tokenValidForTimeSpan.TotalSeconds);

        var url = string.Concat(clientUrl, GetInvitationRelativePath(token.Value));

        var updateResult = await _budgetRepository.UpdateAsync(budget, cancellationToken);

        if(updateResult.IsFailure)
        {
            return updateResult.Error;
        }

        return new InvitationUrl(url, tokenValidForSeconds);
    }
}