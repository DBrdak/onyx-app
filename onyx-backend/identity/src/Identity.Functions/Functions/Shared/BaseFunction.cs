using Amazon.Lambda.Core;
using MediatR;

[assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.SystemTextJson.DefaultLambdaJsonSerializer))]

namespace Identity.Functions.Functions.Shared;

public abstract class BaseFunction
{
    protected const string FullAccessRole = "arn:aws:iam::975049887576:role/FullAccess";
    protected const string BaseRouteV1 = "/api/v1";
    protected readonly ISender Sender;
    protected readonly IServiceProvider ServiceProvider;

    protected BaseFunction(ISender sender, IServiceProvider serviceProvider)
    {
        Sender = sender;
        ServiceProvider = serviceProvider;
    }
}