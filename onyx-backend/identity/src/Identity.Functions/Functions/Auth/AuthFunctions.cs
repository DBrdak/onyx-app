using Amazon.Lambda.Annotations;
using Amazon.Lambda.Annotations.APIGateway;
using Amazon.Lambda.APIGatewayEvents;
using Identity.Application.Auth.ForgotPassword;
using Identity.Application.Auth.GoogleCallback;
using Identity.Application.Auth.GoogleLogin;
using Identity.Application.Auth.LoginUser;
using Identity.Application.Auth.NewPassword;
using Identity.Application.Auth.RefreshAccessToken;
using Identity.Application.Auth.RegisterUser;
using Identity.Application.Auth.ResendEmail;
using Identity.Application.Auth.VerifyEmail;
using Identity.Functions.Functions.Auth.Requests;
using Identity.Functions.Functions.Shared;
using LambdaKernel;
using MediatR;
using static System.Formats.Asn1.AsnWriter;

namespace Identity.Functions.Functions.Auth;

public sealed class AuthFunctions : BaseFunction
{
    private const string authBaseRoute = $"{BaseRouteV1}/auth";

    public AuthFunctions(ISender sender, IServiceProvider serviceProvider) : base(sender, serviceProvider)
    {
    }

    [LambdaFunction(ResourceName = nameof(Login))]
    [HttpApi(LambdaHttpMethod.Post, $"{authBaseRoute}/login")]
    public async Task<APIGatewayHttpApiV2ProxyResponse> Login(
        [FromBody] LoginRequest request)
    {
        var command = new LoginUserCommand(request.Email, request.Password);

        var result = await Sender.Send(command);

        return result.ReturnAPIResponse(200, 401);
    }

    [LambdaFunction(ResourceName = nameof(Register))]
    [HttpApi(LambdaHttpMethod.Post, $"{authBaseRoute}/register")]
    public async Task<APIGatewayHttpApiV2ProxyResponse> Register(
        [FromBody] RegisterRequest request)
    {
        var command = new RegisterUserCommand(request.Email, request.Username, request.Password, request.Currency);

        var result = await Sender.Send(command);

        return result.ReturnAPIResponse(200, 400);
    }

    [LambdaFunction(ResourceName = nameof(VerifyEmail))]
    [HttpApi(LambdaHttpMethod.Put, $"{authBaseRoute}/verify-email")]
    public async Task<APIGatewayHttpApiV2ProxyResponse> VerifyEmail(
        [FromBody] VerifyEmailRequest request)
    {
        var command = new VerifyEmailCommand(request.Email, request.VerificationCode);

        var result = await Sender.Send(command);

        return result.ReturnAPIResponse(200, 401);
    }

    [LambdaFunction(ResourceName = nameof(ResendEmail))]
    [HttpApi(LambdaHttpMethod.Put, $"{authBaseRoute}/resend-email")]
    public async Task<APIGatewayHttpApiV2ProxyResponse> ResendEmail(
        [FromBody] ResendEmailRequest request)
    {
        var command = new ResendEmailCommand(request.Email, request.MessageType);

        var result = await Sender.Send(command);

        return result.ReturnAPIResponse();
    }

    [LambdaFunction(ResourceName = nameof(Refresh))]
    [HttpApi(LambdaHttpMethod.Put, $"{authBaseRoute}/refresh")]
    public async Task<APIGatewayHttpApiV2ProxyResponse> Refresh(
        [FromBody] RefreshRequest request)
    {
        var command = new RefreshAccessTokenCommand(request.LongLivedToken);

        var result = await Sender.Send(command);

        return result.ReturnAPIResponse(200, 401);
    }

    [LambdaFunction(ResourceName = nameof(ForgotPassword))]
    [HttpApi(LambdaHttpMethod.Put, $"{authBaseRoute}/forgot-password/request")]
    public async Task<APIGatewayHttpApiV2ProxyResponse> ForgotPassword(
        [FromBody] RequestNewPasswordRequest request)
    {
        var command = new ForgotPasswordCommand(request.Email);

        var result = await Sender.Send(command);

        return result.ReturnAPIResponse();
    }

    [LambdaFunction(ResourceName = nameof(NewPassword))]
    [HttpApi(LambdaHttpMethod.Put, $"{authBaseRoute}/forgot-password/new")]
    public async Task<APIGatewayHttpApiV2ProxyResponse> NewPassword(
        [FromBody] NewPasswordRequest request)
    {
        var command = new NewPasswordCommand(request.Email, request.NewPassword, request.VerificationCode);

        var result = await Sender.Send(command);

        return result.ReturnAPIResponse();
    }

    [LambdaFunction(ResourceName = nameof(GoogleLogin))]
    [HttpApi(LambdaHttpMethod.Get, $"{authBaseRoute}/google/login")]
    public async Task<APIGatewayHttpApiV2ProxyResponse> GoogleLogin()
    {
        var query = new GoogleLoginQuery();

        var result = await Sender.Send(query);

        return result.IsFailure ?
            result.ReturnAPIResponse(200, 400) :
            new APIGatewayHttpApiV2ProxyResponse
            {
                StatusCode = 302,
                Headers = new Dictionary<string, string> { { "Location", result.Value } }
            };
    }

    [LambdaFunction(ResourceName = nameof(GoogleCallback))]
    [HttpApi(LambdaHttpMethod.Get, $"{authBaseRoute}/google/callback")]
    public async Task<APIGatewayHttpApiV2ProxyResponse> GoogleCallback(APIGatewayHttpApiV2ProxyRequest request)
    {
        _ = request.QueryStringParameters.TryGetValue("code", out var code);

        var command = new GoogleCallbackCommand(code);

        var result = await Sender.Send(command);

        return result.ReturnAPIResponse(200, 400);
    }
}