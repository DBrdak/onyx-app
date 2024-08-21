using Abstractions.Messaging;
using Amazon.Lambda.Core;
using MediatR;
using Microsoft.Extensions.Logging;
using Models.Responses;
using Newtonsoft.Json;

namespace Budget.Application.Behaviors;

public sealed class LoggingBehavior<TRequest, TResponse>
    : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IBaseRequest
    where TResponse : Result
{
    private readonly RequestAccessor _requestAccessor;

    public LoggingBehavior(RequestAccessor requestAccessor)
    {
        _requestAccessor = requestAccessor;
    }

    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
    {
        LogHandleStart();
        TResponse? response = null;

        try
        {
            response = await next();

            if (response.IsSuccess)
            {
                LogHandleSuccess();
                return response;
            }

            LogHandleFailure(response);

            return response;
        }
        catch (Exception e)
        {
            LogHandleException(e);
            return response ?? (TResponse)Error.Exception;
        }
    }

    private void LogHandleException(Exception e)
    {
        LambdaLogger.Log(
            $"Exception occured when executing {typeof(TRequest).Name}: {JsonConvert.SerializeObject(e)}");
    }

    private void LogHandleFailure(TResponse response)
    {
        LambdaLogger.Log(
            $"Failed to handle {typeof(TRequest).Name}: {JsonConvert.SerializeObject(response.Error)}");
    }

    private void LogHandleSuccess()
    {
        LambdaLogger.Log($"Successfully handled {typeof(TRequest).Name}");
    }

    private void LogHandleStart()
    {
        LambdaLogger.Log(
            $"{JsonConvert.SerializeObject(_requestAccessor.Claims)} requested {typeof(TRequest).Name}");
    }
}