﻿using Amazon.Lambda.Annotations.APIGateway;
using Amazon.Lambda.Annotations;
using Amazon.Lambda.APIGatewayEvents;
using Budget.Application.Counterparties.AddCounterparty;
using Budget.Application.Counterparties.GetCounterparties;
using Budget.Application.Counterparties.RemoveCounterparty;
using Budget.Application.Counterparties.UpdateCounterparty;
using Budget.Functions.Functions.Counterparties.Requests;
using Budget.Functions.Functions.Shared;
using LambdaKernel;
using MediatR;


namespace Budget.Functions.Functions.Counterparties;

public sealed class CounterpartyFunctions : BaseFunction
{
    private const string counterpartyBaseRoute = $"{BaseRouteV1}/{{budgetId}}/counterparties";

    public CounterpartyFunctions(
        ISender sender,
        IServiceProvider serviceProvider) : base(
        sender,
        serviceProvider)
    {
    }

    [LambdaFunction(ResourceName = $"Counterparties{nameof(GetAll)}")]
    [HttpApi(LambdaHttpMethod.Get, counterpartyBaseRoute)]
    public async Task<APIGatewayHttpApiV2ProxyResponse> GetAll(
        string budgetId,
        [FromQuery] string type,
        APIGatewayHttpApiV2ProxyRequest requestContext)
    {
        ServiceProvider?.AddRequestContextAccessor(requestContext);

        var query = new GetCounterpartiesQuery(type, Guid.Parse(budgetId));

        var result = await Sender.Send(query);

        return result.ReturnAPIResponse(200, 404);
    }

    [LambdaFunction(ResourceName = $"Counterparties{nameof(Add)}")]
    [HttpApi(LambdaHttpMethod.Post, counterpartyBaseRoute)]
    public async Task<APIGatewayHttpApiV2ProxyResponse> Add(
        string budgetId,
        [FromBody] AddCounterpartyRequest request,
        APIGatewayHttpApiV2ProxyRequest requestContext)
    {
        ServiceProvider?.AddRequestContextAccessor(requestContext);

        var command = new AddCounterpartyCommand(
            request.CounterpartyType,
            request.CounterpartyName,
            Guid.Parse(budgetId));

        var result = await Sender.Send(command);

        return result.ReturnAPIResponse();
    }

    [LambdaFunction(ResourceName = $"Counterparties{nameof(Update)}")]
    [HttpApi(LambdaHttpMethod.Put, $"{counterpartyBaseRoute}/{{counterpartyId}}")]
    public async Task<APIGatewayHttpApiV2ProxyResponse> Update(
        string budgetId,
        string counterpartyId,
        [FromBody] UpdateCounterpartyRequest request,
        APIGatewayHttpApiV2ProxyRequest requestContext)
    {
        ServiceProvider?.AddRequestContextAccessor(requestContext);

        var command = new UpdateCounterpartyCommand(
            Guid.Parse(counterpartyId),
            request.NewName,
            Guid.Parse(budgetId));

        var result = await Sender.Send(command);

        return result.ReturnAPIResponse();
    }

    [LambdaFunction(ResourceName = $"Counterparties{nameof(Remove)}")]
    [HttpApi(LambdaHttpMethod.Delete, $"{counterpartyBaseRoute}/{{counterpartyId}}")]
    public async Task<APIGatewayHttpApiV2ProxyResponse> Remove(
        string budgetId,
        string counterpartyId,
        APIGatewayHttpApiV2ProxyRequest requestContext)
    {
        ServiceProvider?.AddRequestContextAccessor(requestContext);

        var command = new RemoveCounterpartyCommand(Guid.Parse(counterpartyId), Guid.Parse(budgetId));

        var result = await Sender.Send(command);

        return result.ReturnAPIResponse();
    }
}