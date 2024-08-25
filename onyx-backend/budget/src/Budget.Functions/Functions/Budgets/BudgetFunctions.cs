using Amazon.Lambda.Annotations.APIGateway;
using Amazon.Lambda.Annotations;
using Amazon.Lambda.APIGatewayEvents;
using Budget.Application.Budgets.AddBudget;
using Budget.Application.Budgets.AddUserToBudget;
using Budget.Application.Budgets.EditBudget;
using Budget.Application.Budgets.GetBudgetInvitation;
using Budget.Application.Budgets.GetBudgets;
using Budget.Application.Budgets.RemoveBudget;
using Budget.Application.Budgets.RemoveUserFromBudgetBudget;
using Budget.Functions.Functions.Budgets.Requests;
using Budget.Functions.Functions.Shared;
using LambdaKernel;
using MediatR;


namespace Budget.Functions.Functions.Budgets;

public sealed class BudgetFunctions : BaseFunction
{
    private const string budgetBaseRoute = $"{BaseRouteV1}/budgets";

    public BudgetFunctions(ISender sender, IServiceProvider serviceProvider) : base(sender, serviceProvider)
    {

    }

    [LambdaFunction(ResourceName = $"Budgets{nameof(GetAll)}")]
    [HttpApi(LambdaHttpMethod.Get, budgetBaseRoute)]
    public async Task<APIGatewayHttpApiV2ProxyResponse> GetAll(APIGatewayHttpApiV2ProxyRequest requestContext)
    {
        ServiceProvider?.AddRequestContextAccessor(requestContext);

        var command = new GetBudgetsQuery();

        var result = await Sender.Send(command);

        return result.ReturnAPIResponse(200, 404);
    }

    [LambdaFunction(ResourceName = $"Budgets{nameof(GetInvitation)}")]
    [HttpApi(LambdaHttpMethod.Put, $"{budgetBaseRoute}/{{budgetId}}/invitation")]
    public async Task<APIGatewayHttpApiV2ProxyResponse> GetInvitation(
        string budgetId,
        APIGatewayHttpApiV2ProxyRequest requestContext)
    {
        ServiceProvider?.AddRequestContextAccessor(requestContext);

        var protocol = requestContext.Headers.TryGetValue(
            "X-Forwarded-Proto",
            out var protocolHeader) ?
            protocolHeader :
            "https";
        var host = requestContext.Headers["Host"];
        var path = requestContext.RawPath;
        var baseUrl = $"{protocol}://{host}{path}";
        var command = new GetBudgetInvitationQuery(Guid.Parse(budgetId), baseUrl);

        var result = await Sender.Send(command);

        return result.ReturnAPIResponse();
    }

    [LambdaFunction(ResourceName = $"Budgets{nameof(Add)}")]
    [HttpApi(LambdaHttpMethod.Post, budgetBaseRoute)]
    public async Task<APIGatewayHttpApiV2ProxyResponse> Add(
        [FromBody] AddBudgetRequest request,
        APIGatewayHttpApiV2ProxyRequest requestContext)
    {
        ServiceProvider?.AddRequestContextAccessor(requestContext);

        var command = new AddBudgetCommand(request.BudgetName, request.BudgetCurrency);

        var result = await Sender.Send(command);

        return result.ReturnAPIResponse();
    }

    [LambdaFunction(ResourceName = $"Budgets{nameof(RemoveUser)}")]
    [HttpApi(LambdaHttpMethod.Put, $"{budgetBaseRoute}/{{budgetId}}/remove/{{userId}}")]
    public async Task<APIGatewayHttpApiV2ProxyResponse> RemoveUser(
        string budgetId,
        string userId, 
        APIGatewayHttpApiV2ProxyRequest requestContext)
    {
        ServiceProvider?.AddRequestContextAccessor(requestContext);

        var command = new RemoveUserFromBudgetCommand(Guid.Parse(budgetId), userId);

        var result = await Sender.Send(command);

        return result.ReturnAPIResponse();
    }

    [LambdaFunction(ResourceName = $"Budgets{nameof(Join)}")]
    [HttpApi(LambdaHttpMethod.Put, $"{budgetBaseRoute}/{{budgetId}}/join/{{token}}")]
    public async Task<APIGatewayHttpApiV2ProxyResponse> Join(
        string budgetId,
        string token,
        APIGatewayHttpApiV2ProxyRequest requestContext)
    {
        ServiceProvider?.AddRequestContextAccessor(requestContext);

        var command = new AddUserToBudgetCommand(Guid.Parse(budgetId), token);

        var result = await Sender.Send(command);

        return result.ReturnAPIResponse();
    }

    [LambdaFunction(ResourceName = $"Budgets{nameof(Remove)}")]
    [HttpApi(LambdaHttpMethod.Delete, $"{budgetBaseRoute}/{{budgetId}}")]
    public async Task<APIGatewayHttpApiV2ProxyResponse> Remove(
        string budgetId, 
        APIGatewayHttpApiV2ProxyRequest requestContext)
    {
        ServiceProvider?.AddRequestContextAccessor(requestContext);

        var command = new RemoveBudgetCommand(Guid.Parse(budgetId));

        var result = await Sender.Send(command);

        return result.ReturnAPIResponse();
    }

    [LambdaFunction(ResourceName = $"Budgets{nameof(Edit)}")]
    [HttpApi(LambdaHttpMethod.Put, $"{budgetBaseRoute}/{{budgetId}}/edit")]
    public async Task<APIGatewayHttpApiV2ProxyResponse> Edit(
        string budgetId,
        [FromBody] BudgetEditRequest request,
        APIGatewayHttpApiV2ProxyRequest requestContext)
    {
        ServiceProvider?.AddRequestContextAccessor(requestContext);

        var command = new EditBudgetCommand(request.NewBudgetName);

        var result = await Sender.Send(command);

        return result.ReturnAPIResponse();
    }
}