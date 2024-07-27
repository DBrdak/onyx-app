using Amazon.Lambda.APIGatewayEvents;
using Amazon.Lambda.Core;
using Amazon.Lambda.Annotations;
using Identity.Application.Abstractions.Authentication;
using Identity.Functions.Functions.Shared;
using MediatR;
using MongoDB.Bson;
using Newtonsoft.Json;
using Serilog;

namespace Identity.Functions.Functions.Access;

internal sealed class AccessFunction : BaseFunction
{
    private readonly IJwtService _jwtService;

    public AccessFunction(IJwtService jwtService, ISender sender) : base(sender)
    {
        _jwtService = jwtService;
    }

    [LambdaFunction(Role = FullAccessRole, ResourceName = "LambdaAuthorizer")]
    public APIGatewayCustomAuthorizerV2IamResponse FunctionHandler(APIGatewayCustomAuthorizerRequest request, ILambdaContext context)
    {
        try
        {
            var token = request.AuthorizationToken?.Replace("Bearer ", string.Empty) ??
                        request.Headers.FirstOrDefault(kvp => kvp.Key.ToLower() == "authorization").Value
                            ?.Replace("Bearer ", string.Empty);

            var validationResult = _jwtService.ValidateJwt(token, out var principalId);

            context.Logger.Log("wrizz");
            return GeneratePolicy(
                principalId,
                validationResult,
                request.MethodArn);
        }
        catch (Exception e)
        {
            context.Logger.Log(JsonConvert.SerializeObject(e));
            context.Logger.Log("sadge");
            throw;
        }
    }

    private static APIGatewayCustomAuthorizerV2IamResponse GeneratePolicy(string principalId, string effect, string resource)
    {
        return new APIGatewayCustomAuthorizerV2IamResponse
        {
            PrincipalID = principalId,
            PolicyDocument = new APIGatewayCustomAuthorizerPolicy
            {
                Version = "2012-10-17",
                Statement =
                [
                    new()
                    {
                        Action = ["execute-api:Invoke"],
                        Effect = effect,
                        Resource = [resource]
                    }
                ]
            }
        };
    }
}