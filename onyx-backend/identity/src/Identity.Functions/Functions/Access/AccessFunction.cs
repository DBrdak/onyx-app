using Amazon.Lambda.APIGatewayEvents;
using Amazon.Lambda.Core;
using Amazon.Lambda.Annotations;
using Identity.Application.Abstractions.Authentication;
using Identity.Application.Auth.ServiceSpecific.Budget.IsBudgetMember;
using Identity.Functions.Functions.Shared;
using MediatR;

namespace Identity.Functions.Functions.Access;

internal sealed class AccessFunction : BaseFunction
{
    private readonly IJwtService _jwtService;

    public AccessFunction(IJwtService jwtService, ISender sender, IServiceProvider serviceProvider) : base(sender, serviceProvider)
    {
        _jwtService = jwtService;
    }

    [LambdaFunction(ResourceName = "LambdaAuthorizer")]
    public APIGatewayCustomAuthorizerV2SimpleResponse FunctionHandler(
        APIGatewayCustomAuthorizerV2Request request,
        ILambdaContext context)
    {
        var token = request.Headers
            .FirstOrDefault(kvp => kvp.Key.ToLower() == "authorization").Value?
            .Replace("Bearer ", string.Empty);

        var isAuthorized = _jwtService.ValidateJwt(token, out var principalId);
        context.Logger.Log("Hello");
        //if (pathParams.TryGetValue("budgetId", out var budgetId) && !string.IsNullOrWhiteSpace(budgetId))
        //{
        //    return new APIGatewayCustomAuthorizerV2SimpleResponse
        //    {
        //        IsAuthorized = await Sender.Send(
        //                           new IsBudgetMemberQuery(
        //                               token,
        //                               budgetId)) is var result &&
        //                       result.IsSuccess &&
        //                       result.Value
        //    };
        //}

        return new APIGatewayCustomAuthorizerV2SimpleResponse
        {
            IsAuthorized = isAuthorized
        };
    }
}