﻿using Amazon.Lambda.Annotations;
using Amazon.Lambda.Annotations.APIGateway;
using Amazon.Lambda.APIGatewayEvents;
using Budget.Application.Accounts.AddAccount;
using Budget.Application.Accounts.BulkAddTransactions;
using Budget.Application.Accounts.GetAccounts;
using Budget.Application.Accounts.RemoveAccount;
using Budget.Application.Accounts.UpdateAccount;
using Budget.Functions.Functions.Accounts.Requests;
using Budget.Functions.Functions.Shared;
using LambdaKernel;
using MediatR;

#pragma warning disable CS1591

namespace Budget.Functions.Functions.Accounts;

public sealed class AccountFunctions : BaseFunction
{
    private const string accountsBaseRoute = $"{BaseRouteV1}/{{budgetId}}/accounts";

    public AccountFunctions(ISender sender) : base(sender)
    {
        
    }

    [LambdaFunction(Role = FullAccessRole, ResourceName = $"Accounts{nameof(GetAll)}")]
    [HttpApi(LambdaHttpMethod.Get, accountsBaseRoute)]
    public async Task<APIGatewayHttpApiV2ProxyResponse> GetAll(
        string budgetId,
        APIGatewayHttpApiV2ProxyRequest requestContext)
    {
        ServiceProvider?.AddRequestContextAccessor(requestContext);

        var query = new GetAccountsQuery(Guid.Parse(budgetId));

        var result = await Sender.Send(query);

        return result.ReturnAPIResponse(200, 404);
    }

    [LambdaFunction(Role = FullAccessRole, ResourceName = $"Accounts{nameof(Add)}")]
    [HttpApi(LambdaHttpMethod.Post, accountsBaseRoute)]
    public async Task<APIGatewayHttpApiV2ProxyResponse> Add(
        string budgetId,
        [FromBody] AddAccountRequest request,
        APIGatewayHttpApiV2ProxyRequest requestContext)
    {
        ServiceProvider?.AddRequestContextAccessor(requestContext);

        var command = new AddAccountCommand(request.Name, request.Balance, request.AccountType, Guid.Parse(budgetId));

        var result = await Sender.Send(command);

        return result.ReturnAPIResponse();
    }

    [LambdaFunction(Role = FullAccessRole, ResourceName = $"Accounts{nameof(Update)}")]
    [HttpApi(LambdaHttpMethod.Put, $"{accountsBaseRoute}/{{accountId}}")]
    public async Task<APIGatewayHttpApiV2ProxyResponse> Update(
        string budgetId,
        string accountId,
        [FromBody] UpdateAccountRequest request,
        APIGatewayHttpApiV2ProxyRequest requestContext)
    {
        ServiceProvider?.AddRequestContextAccessor(requestContext);

        var command = new UpdateAccountCommand(Guid.Parse(accountId), request.NewName, request.NewBalance, Guid.Parse(budgetId));

        var result = await Sender.Send(command);

        return result.ReturnAPIResponse();
    }

    [LambdaFunction(Role = FullAccessRole, ResourceName = $"Accounts{nameof(Remove)}")]
    [HttpApi(LambdaHttpMethod.Delete, $"{accountsBaseRoute}/{{accountId}}")]
    public async Task<APIGatewayHttpApiV2ProxyResponse> Remove(
        string budgetId,
        string accountId,
        APIGatewayHttpApiV2ProxyRequest requestContext)
    {
        ServiceProvider?.AddRequestContextAccessor(requestContext);

        var command = new RemoveAccountCommand(Guid.Parse(accountId), Guid.Parse(budgetId));

        var result = await Sender.Send(command);

        return result.ReturnAPIResponse();
    }

    [LambdaFunction(Role = FullAccessRole, ResourceName = $"Accounts{nameof(BulkAddTransactions)}")]
    [HttpApi(LambdaHttpMethod.Post, $"{accountsBaseRoute}/{{accountId}}/transactions/bulk")]
    public async Task<APIGatewayHttpApiV2ProxyResponse> BulkAddTransactions(
        string budgetId,
        string accountId,
        [FromBody] AccountBulkAddTransactionsRequest request,
        APIGatewayHttpApiV2ProxyRequest requestContext)
    {
        ServiceProvider?.AddRequestContextAccessor(requestContext);

        var command = new BulkAddTransactionsCommand(
            request.Transactions.Select(
                t => new TransactionAddModel(
                    t.Amount,
                    t.TransactedAt,
                    t.CounterpartyName,
                    t.SubcategoryId)),
            Guid.Parse(accountId),
            Guid.Parse(budgetId));

        var result = await Sender.Send(command);

        return result.ReturnAPIResponse();
    }
}