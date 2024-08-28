using Amazon.Lambda.Annotations;
using Amazon.Lambda.Annotations.APIGateway;
using Amazon.Lambda.APIGatewayEvents;
using Amazon.Lambda.Core;
using Amazon.Lambda.SQSEvents;
using Identity.Application.User.AddBudgetIdForUser;
using Identity.Application.User.GetUser;
using Identity.Application.User.LogoutUser;
using Identity.Application.User.RemoveBudgetIdForUser;
using Identity.Application.User.RemoveUser;
using Identity.Application.User.RequestEmailChange;
using Identity.Application.User.UpdateUser;
using Identity.Functions.Functions.Shared;
using Identity.Functions.Functions.User.Requests;
using LambdaKernel;
using MediatR;
using Newtonsoft.Json;

namespace Identity.Functions.Functions.User;

public sealed class UserFunctions : BaseFunction
{
    private const string usersBaseRoute = $"{BaseRouteV1}/user";

    public UserFunctions(ISender sender, IServiceProvider serviceProvider) : base(sender, serviceProvider)
    { }

    [LambdaFunction(ResourceName = nameof(GetUser))]
    [HttpApi(LambdaHttpMethod.Get, $"{usersBaseRoute}")]
    public async Task<APIGatewayHttpApiV2ProxyResponse> GetUser(APIGatewayHttpApiV2ProxyRequest requestContext)
    {
        ServiceProvider.AddRequestContextAccessor(requestContext);

        var query = new GetUserQuery();

        var result = await Sender.Send(query);

        return result.ReturnAPIResponse(200, 404);
    }

    [LambdaFunction(ResourceName = nameof(UpdateUser))]
    [HttpApi(LambdaHttpMethod.Put, $"{usersBaseRoute}")]
    public async Task<APIGatewayHttpApiV2ProxyResponse> UpdateUser(
        [FromBody] UpdateUserRequest request,
        APIGatewayHttpApiV2ProxyRequest requestContext)
    {
        ServiceProvider.AddRequestContextAccessor(requestContext);

        var command = new UpdateUserCommand(
            request.NewEmail,
            request.NewUsername,
            request.NewCurrency,
            request.VerificationCode);

        var result = await Sender.Send(command);

        return result.ReturnAPIResponse();
    }

    [LambdaFunction(ResourceName = nameof(RequestEmailChange))]
    [HttpApi(LambdaHttpMethod.Put, $"{usersBaseRoute}/change-email")]
    public async Task<APIGatewayHttpApiV2ProxyResponse> RequestEmailChange(APIGatewayHttpApiV2ProxyRequest requestContext)
    {
        ServiceProvider.AddRequestContextAccessor(requestContext);

        var command = new RequestEmailChangeCommand();

        var result = await Sender.Send(command);

        return result.ReturnAPIResponse();
    }

    [LambdaFunction(ResourceName = nameof(Logout))]
    [HttpApi(LambdaHttpMethod.Put, $"{usersBaseRoute}/logout")]
    public async Task<APIGatewayHttpApiV2ProxyResponse> Logout(APIGatewayHttpApiV2ProxyRequest requestContext)
    {
        ServiceProvider.AddRequestContextAccessor(requestContext);

        var command = new LogoutUserCommand();

        var result = await Sender.Send(command);

        return result.ReturnAPIResponse();
    }

    [LambdaFunction(ResourceName = nameof(RemoveUser))]
    [HttpApi(LambdaHttpMethod.Delete, $"{usersBaseRoute}/remove")]
    public async Task<APIGatewayHttpApiV2ProxyResponse> RemoveUser(
        [FromBody] RemoveUserRequest request,
        APIGatewayHttpApiV2ProxyRequest requestContext)
    {
        ServiceProvider.AddRequestContextAccessor(requestContext);

        var command = new RemoveUserCommand(request.Password);

        var result = await Sender.Send(command);

        return result.ReturnAPIResponse();
    }

    [LambdaFunction(ResourceName = nameof(RemoveBudgetIdForUser))]
    public async Task RemoveBudgetIdForUser(SQSEvent evnt, ILambdaContext lambdaContext)
    {
        try
        {
            foreach (var message in evnt.Records)
            {
                var command = JsonConvert.DeserializeObject<RemoveBudgetIdForUserCommand>(message.Body) ??
                              throw new ArgumentException(
                                  $"Invalid message body for {nameof(RemoveBudgetIdForUser)} Lambda queue handler");

                await Sender.Send(command);
            }
        }
        catch (Exception e)
        {
            lambdaContext.Logger.LogError(
                $"Problem occured when trying to execute {nameof(RemoveBudgetIdForUser)} Lambda queue handler\n" +
                $"Details: {e.Message}");
        }
    }

    [LambdaFunction(ResourceName = nameof(AddBudgetIdForUser))]
    public async Task AddBudgetIdForUser(SQSEvent evnt, ILambdaContext lambdaContext)
    {
        try
        {
            foreach (var message in evnt.Records)
            {
                var command = JsonConvert.DeserializeObject<AddBudgetIdForUserCommand>(message.Body) ??
                              throw new ArgumentException(
                                  $"Invalid message body for {nameof(AddBudgetIdForUser)} Lambda queue handler");

                await Sender.Send(command);
            }
        }
        catch (Exception e)
        {
            lambdaContext.Logger.LogError(
                $"Problem occured when trying to execute {nameof(AddBudgetIdForUser)} Lambda queue handler\n" +
                $"Details: {e.Message}");
        }
    }
}