﻿using System.ComponentModel.DataAnnotations;
using Amazon.Lambda.Core;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Models.Exceptions;
using Models.Responses;

namespace Identity.Functions.Middlewares;

public sealed class ExceptionMiddleware
{
    private readonly ILambdaLogger _logger;
    private readonly RequestDelegate _next;

    public ExceptionMiddleware(
        RequestDelegate next,
        ILambdaLogger logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception exception)
        {
            var exceptionDetails = GetExceptionDetails(exception);

            var problemDetails = new ProblemDetails
            {
                Status = exceptionDetails.Status,
                Type = exceptionDetails.Type,
                Title = exceptionDetails.Title,
                Detail = exceptionDetails.Detail,
            };

            if (exceptionDetails.Errors is not null)
            {
                problemDetails.Extensions["errors"] = exceptionDetails.Errors;
            }

            LogException(exceptionDetails, exception);

            context.Response.StatusCode = exceptionDetails.Status;

            if (exceptionDetails.Errors is null)
                await context.Response.WriteAsJsonAsync(Result.Failure(Error.ExceptionWithMessage(exceptionDetails.Title)));
            else
                await context.Response.WriteAsJsonAsync(
                    Result.Failure(
                        Error.ValidationError(exceptionDetails.Errors.Select(e => e.ToString()))));
        }
    }

    private static ExceptionDetails GetExceptionDetails(Exception exception)
    {
        return exception switch
        {
            ValidationException validationException => new ExceptionDetails(
                StatusCodes.Status400BadRequest,
                validationException.GetType().Name,
                "Validation error",
                "One or more validation errors has occurred",
                validationException.ValidationResult.MemberNames),
            DomainException domainException => new ExceptionDetails(
                StatusCodes.Status400BadRequest,
                domainException.GetType().Name,
                $"{domainException.Type.Name} Domain error",
                domainException.Message,
                null),
            ApplicationException applicationException => new ExceptionDetails(
                StatusCodes.Status400BadRequest,
                applicationException.GetType().Name,
                "Application error",
                applicationException.Message,
                null),
            _ => new ExceptionDetails(
                StatusCodes.Status500InternalServerError,
                "ServerError",
                "Server error",
                "An unexpected error has occurred",
                null)
        };
    }

    private void LogException(ExceptionDetails details, Exception exception)
    {
        _logger.LogError($"{details.Title} occurred: {exception.Message}");
    }

    internal record ExceptionDetails(
        int Status,
        string Type,
        string Title,
        string Detail,
        IEnumerable<object>? Errors);
}