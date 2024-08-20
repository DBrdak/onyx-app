using Amazon.Lambda.Core;
using Amazon.Lambda.SNSEvents;
using Messanger.Lambda.Models;
using Messanger.Lambda.Services.Emails;
using Models.Responses;
using Newtonsoft.Json;

[assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.SystemTextJson.DefaultLambdaJsonSerializer))]

namespace Messanger.Lambda.Functions.Emails;

public sealed class EmailLambda
{
    public EmailLambda()
    { }


    public async Task FunctionHandler(SNSEvent snsEvent, ILambdaContext context)
    {
        List<Result> results = [];
        var emailSerivce = new EmailService();

        foreach (var record in snsEvent.Records)
        {
            var messageAttributes = record.Sns.MessageAttributes;
            var data = EmailData.FromMessageAttributes(messageAttributes);

            results.Add(await emailSerivce.SendAsync(data));
        }

        results.Where(r => r.IsFailure).ToList()
            .ForEach(r => context.Logger.LogError(JsonConvert.SerializeObject(r.Error)));
    }
}