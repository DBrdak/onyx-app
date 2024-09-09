using Amazon.Lambda.Annotations.APIGateway;
using Amazon.Lambda.Annotations;
using Amazon.Lambda.APIGatewayEvents;
using Amazon.Lambda.Core;
using Amazon.Lambda.SQSEvents;
using Budget.Application.Budgets.AddBudget;
using Budget.Application.Budgets.AddUserToBudget;
using Budget.Application.Budgets.EditBudget;
using Budget.Application.Budgets.GetBudgetByToken;
using Budget.Application.Budgets.GetBudgetInvitation;
using Budget.Application.Budgets.GetBudgets;
using Budget.Application.Budgets.PurgeUserData;
using Budget.Application.Budgets.RemoveBudget;
using Budget.Application.Budgets.RemoveUserFromBudgetBudget;
using Budget.Functions.Functions.Budgets.Requests;
using Budget.Functions.Functions.Shared;
using LambdaKernel;
using MediatR;
using Newtonsoft.Json;


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
        APIGatewayHttpApiV2ProxyRequest requestContext,
        ILambdaContext context)
    {
        ServiceProvider?.AddRequestContextAccessor(requestContext);
        context.Logger.Log(JsonConvert.SerializeObject(requestContext));

        requestContext.Headers.TryGetValue("Origin", out var clientUrl); 
        var command = new GetBudgetInvitationQuery(Guid.Parse(budgetId), clientUrl);

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
    [HttpApi(LambdaHttpMethod.Put, $"{budgetBaseRoute}/join/{{token}}")]
    public async Task<APIGatewayHttpApiV2ProxyResponse> Join(
        string token,
        APIGatewayHttpApiV2ProxyRequest requestContext)
    {
        ServiceProvider?.AddRequestContextAccessor(requestContext);

        var command = new AddUserToBudgetCommand(token);

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

    [LambdaFunction(ResourceName = $"Budgets{nameof(GetByInvitationToken)}")]
    [HttpApi(LambdaHttpMethod.Get, $"{budgetBaseRoute}/{{token}}")]
    public async Task<APIGatewayHttpApiV2ProxyResponse> GetByInvitationToken(
        string token,
        APIGatewayHttpApiV2ProxyRequest requestContext)
    {
        ServiceProvider?.AddRequestContextAccessor(requestContext);

        var command = new GetBudgetByTokenQuery(token);

        var result = await Sender.Send(command);

        return result.ReturnAPIResponse();
    }

    [LambdaFunction(ResourceName = nameof(PurgeUserBudgetData))]
    public async Task PurgeUserBudgetData(SQSEvent evnt, ILambdaContext lambdaContext)
    {
        try
        {
            foreach (var message in evnt.Records)
            {
                var command = JsonConvert.DeserializeObject<PurgeUserDataCommand>(message.Body) ??
                              throw new ArgumentException(
                                  $"Invalid message body for {nameof(PurgeUserBudgetData)} Lambda queue handler");

                await Sender.Send(command);
            }
        }
        catch (Exception e)
        {
            lambdaContext.Logger.LogError(
                $"Problem occured when trying to execute {nameof(PurgeUserBudgetData)} Lambda queue handler\n" +
                $"Details: {e.Message}\n" +
                $"Exception:\n{JsonConvert.SerializeObject(e)}");
        }
    }
}