using Amazon.Lambda.Annotations.APIGateway;
using Amazon.Lambda.Annotations;
using Amazon.Lambda.APIGatewayEvents;
using Budget.Application.Transactions.AddTransaction;
using Budget.Application.Transactions.GetTransactions;
using Budget.Application.Transactions.RemoveTransaction;
using Budget.Functions.Functions.Shared;
using Budget.Functions.Functions.Transactions.Requests;
using LambdaKernel;
using MediatR;
using Budget.Application.Transactions.BulkRemoveTransactions;
using Budget.Application.Transactions.SetSubcategory;

namespace Budget.Functions.Functions.Transactions;

public sealed class TransactionFunctions : BaseFunction
{
    private const string transactionBaseRoute = $"{BaseRouteV1}/{{budgetId}}/transactions";

    public TransactionFunctions(ISender sender, IServiceProvider serviceProvider) : base(sender, serviceProvider)
    {
        
    }

    [LambdaFunction(ResourceName = $"Transactions{nameof(Get)}")]
    [HttpApi(LambdaHttpMethod.Get, transactionBaseRoute)]
    public async Task<APIGatewayHttpApiV2ProxyResponse> Get(
        string budgetId,
        [FromQuery] string? counterpartyId,
        [FromQuery] string? accountId,
        [FromQuery] string? subcategoryId,
        APIGatewayHttpApiV2ProxyRequest requestContext)
    {
        ServiceProvider?.AddRequestContextAccessor(requestContext);

        var transactionsQuery = new GetTransactionsQuery(
            counterpartyId is null ? null : Guid.Parse(counterpartyId),
            accountId is null ? null : Guid.Parse(accountId),
            subcategoryId is null ? null : Guid.Parse(subcategoryId),
            Guid.Parse(budgetId));

        var result = await Sender.Send(transactionsQuery);

        return result.ReturnAPIResponse(200, 404);
    }

    [LambdaFunction(ResourceName = $"Transactions{nameof(Add)}")]
    [HttpApi(LambdaHttpMethod.Post, transactionBaseRoute)]
    public async Task<APIGatewayHttpApiV2ProxyResponse> Add(
        string budgetId,
        [FromBody] AddTransactionRequest request,
        APIGatewayHttpApiV2ProxyRequest requestContext)
    {
        ServiceProvider?.AddRequestContextAccessor(requestContext);

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

    [LambdaFunction(ResourceName = $"Transactions{nameof(Remove)}")]
    [HttpApi(LambdaHttpMethod.Delete, $"{transactionBaseRoute}/{{transactionId}}")]
    public async Task<APIGatewayHttpApiV2ProxyResponse> Remove(
        string budgetId,
        string transactionId,
        APIGatewayHttpApiV2ProxyRequest requestContext)
    {
        ServiceProvider?.AddRequestContextAccessor(requestContext);

        var command = new RemoveTransactionCommand(Guid.Parse(transactionId), Guid.Parse(budgetId));

        var result = await Sender.Send(command);

        return result.ReturnAPIResponse();
    }

    [LambdaFunction(ResourceName = $"Transactions{nameof(BulkRemove)}")]
    [HttpApi(LambdaHttpMethod.Delete, $"{transactionBaseRoute}/bulk")]
    public async Task<APIGatewayHttpApiV2ProxyResponse> BulkRemove(
        string budgetId,
        [FromBody] string[] transactionIds,
        APIGatewayHttpApiV2ProxyRequest requestContext)
    {
        ServiceProvider?.AddRequestContextAccessor(requestContext);

        var command = new BulkRemoveTransactionsCommand(
            transactionIds.Select(Guid.Parse).ToArray(),
            Guid.Parse(budgetId));

        var result = await Sender.Send(command);

        return result.ReturnAPIResponse();
    }

    [LambdaFunction(ResourceName = $"Transactions{nameof(SetSubcategory)}")]
    [HttpApi(LambdaHttpMethod.Put, $"{transactionBaseRoute}/subcategory")]
    public async Task<APIGatewayHttpApiV2ProxyResponse> SetSubcategory(
        string budgetId,
        [FromBody] SetSubcategoryRequest request,
        APIGatewayHttpApiV2ProxyRequest requestContext)
    {
        ServiceProvider?.AddRequestContextAccessor(requestContext);

        var command = new SetSubcategoryCommand(
            Guid.Parse(request.TransactionId),
            Guid.Parse(request.SubcategoryId));

        var result = await Sender.Send(command);

        return result.ReturnAPIResponse();
    }
}