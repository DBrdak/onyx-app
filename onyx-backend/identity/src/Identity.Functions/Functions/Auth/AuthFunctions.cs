﻿using Amazon.Lambda.Annotations;
using Amazon.Lambda.Annotations.APIGateway;
using Amazon.Lambda.APIGatewayEvents;
using Identity.Application.Auth.ForgotPassword;
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
using Microsoft.Extensions.DependencyInjection;

namespace Identity.Functions.Functions.Auth;

public sealed class AuthFunctions : BaseFunction
{
    private const string authBaseRoute = $"{BaseRouteV1}/auth";

    public AuthFunctions(ISender sender, IServiceProvider serviceProvider) : base(sender, serviceProvider)
    {
    }

    [LambdaFunction(Role = FullAccessRole, ResourceName = nameof(Login))]
    [HttpApi(LambdaHttpMethod.Post, $"{authBaseRoute}/login")]
    public async Task<APIGatewayHttpApiV2ProxyResponse> Login(
        [FromBody] LoginRequest request)
    {
        var command = new LoginUserCommand(request.Email, request.Password);

        var result = await Sender.Send(command);

        return result.ReturnAPIResponse(200, 401);
    }

    [LambdaFunction(Role = FullAccessRole, ResourceName = nameof(Register))]
    [HttpApi(LambdaHttpMethod.Post, $"{authBaseRoute}/register")]
    public async Task<APIGatewayHttpApiV2ProxyResponse> Register(
        [FromBody] RegisterRequest request)
    {
        var command = new RegisterUserCommand(request.Email, request.Username, request.Password, request.Currency);

        var result = await Sender.Send(command);

        return result.ReturnAPIResponse(200, 400);
    }

    [LambdaFunction(Role = FullAccessRole, ResourceName = nameof(VerifyEmail))]
    [HttpApi(LambdaHttpMethod.Put, $"{authBaseRoute}/verify-email")]
    public async Task<APIGatewayHttpApiV2ProxyResponse> VerifyEmail(
        [FromBody] VerifyEmailRequest request)
    {
        var command = new VerifyEmailCommand(request.Email, request.VerificationCode);

        var result = await Sender.Send(command);

        return result.ReturnAPIResponse(200, 401);
    }

    [LambdaFunction(Role = FullAccessRole, ResourceName = nameof(ResendEmail))]
    [HttpApi(LambdaHttpMethod.Put, $"{authBaseRoute}/resend-email")]
    public async Task<APIGatewayHttpApiV2ProxyResponse> ResendEmail(
        [FromBody] ResendEmailRequest request)
    {
        var command = new ResendEmailCommand(request.Email, request.MessageType);

        var result = await Sender.Send(command);

        return result.ReturnAPIResponse();
    }

    [LambdaFunction(Role = FullAccessRole, ResourceName = nameof(Refresh))]
    [HttpApi(LambdaHttpMethod.Put, $"{authBaseRoute}/refresh")]
    public async Task<APIGatewayHttpApiV2ProxyResponse> Refresh(
        [FromBody] RefreshRequest request,
        [FromHeader(Name = "Authorization")] string expiredToken)
    {
        var command = new RefreshAccessTokenCommand(request.LongLivedToken, expiredToken);

        var result = await Sender.Send(command);

        return result.ReturnAPIResponse(200, 401);
    }

    [LambdaFunction(Role = FullAccessRole, ResourceName = nameof(ForgotPassword))]
    [HttpApi(LambdaHttpMethod.Put, $"{authBaseRoute}/forgot-password/request")]
    public async Task<APIGatewayHttpApiV2ProxyResponse> ForgotPassword(
        [FromBody] NewPasswordRequest request)
    {
        var command = new ForgotPasswordCommand(request.Email);

        var result = await Sender.Send(command);

        return result.ReturnAPIResponse();
    }

    [LambdaFunction(Role = FullAccessRole, ResourceName = nameof(NewPassword))]
    [HttpApi(LambdaHttpMethod.Put, $"{authBaseRoute}/forgot-password/new")]
    public async Task<APIGatewayHttpApiV2ProxyResponse> NewPassword(
        [FromBody] NewPasswordRequest request)
    {
        var command = new NewPasswordCommand(request.Email, request.NewPassword, request.VerificationCode);

        var result = await Sender.Send(command);

        return result.ReturnAPIResponse();
    }
}