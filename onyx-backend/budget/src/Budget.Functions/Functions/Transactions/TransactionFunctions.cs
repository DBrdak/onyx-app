﻿using Amazon.Lambda.Annotations.APIGateway;
using Amazon.Lambda.Annotations;
using Amazon.Lambda.APIGatewayEvents;
using Budget.Application.Transactions.AddTransaction;
using Budget.Application.Transactions.GetTransactions;
using Budget.Application.Transactions.RemoveTransaction;
using Budget.Functions.Functions.Shared;
using Budget.Functions.Functions.Transactions.Requests;
using LambdaKernel;
using MediatR;

namespace Budget.Functions.Functions.Transactions;

public sealed class TransactionFunctions : BaseFunction
{
    private const string transactionBaseRoute = $"{BaseRouteV1}/{{budgetId}}/transactions";

    public TransactionFunctions(ISender sender) : base(sender)
    {
        
    }

    [LambdaFunction(Role = FullAccessRole, ResourceName = $"Transactions{nameof(Get)}")]
    [HttpApi(LambdaHttpMethod.Get, transactionBaseRoute)]
    public async Task<APIGatewayHttpApiV2ProxyResponse> Get(
        string budgetId,
        [FromQuery] string? counterpartyId,
        [FromQuery] string? accountId,
        [FromQuery] string? subcategoryId)
    {
        var transactionsQuery = new GetTransactionsQuery(
            counterpartyId is null ? null : Guid.Parse(counterpartyId),
            accountId is null ? null : Guid.Parse(accountId),
            subcategoryId is null ? null : Guid.Parse(subcategoryId),
            Guid.Parse(budgetId));

        var result = await Sender.Send(transactionsQuery);

        return result.ReturnAPIResponse(200, 404);
    }

    [LambdaFunction(Role = FullAccessRole, ResourceName = $"Transactions{nameof(Add)}")]
    [HttpApi(LambdaHttpMethod.Post, transactionBaseRoute)]
    public async Task<APIGatewayHttpApiV2ProxyResponse> Add(
        string budgetId,
        [FromBody] AddTransactionRequest request)
    {
        var command = new AddTransactionCommand(
            request.AccountId,
            request.Amount,
            request.TransactedAt,
            request.CounterpartyName,
            request.SubcategoryId,
            Guid.Parse(budgetId));

        var result = await Sender.Send(command);

        return result.ReturnAPIResponse();
    }

    [LambdaFunction(Role = FullAccessRole, ResourceName = $"Transactions{nameof(Remove)}")]
    [HttpApi(LambdaHttpMethod.Get, $"{transactionBaseRoute}/{{transactionId}}")]
    public async Task<APIGatewayHttpApiV2ProxyResponse> Remove(
        string budgetId,
        string transactionId)
    {
        var command = new RemoveTransactionCommand(Guid.Parse(transactionId), Guid.Parse(budgetId));

        var result = await Sender.Send(command);

        return result.ReturnAPIResponse();
    }
}