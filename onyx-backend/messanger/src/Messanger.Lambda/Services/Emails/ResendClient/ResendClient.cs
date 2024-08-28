using System.Net.Http.Json;
using Messanger.Lambda.Models;
using Models.Responses;
using Newtonsoft.Json;
using SharedDAL.SecretsManager;
using JsonSerializer = System.Text.Json.JsonSerializer;

namespace Messanger.Lambda.Services.Emails.ResendClient;

internal sealed class ResendClient
{
    private readonly HttpClient _httpClient = new();
    private const string sendEmailPath = "https://api.resend.com/emails";
    private const string secretName = "onyx/resend";

    public async Task<Result> SendEmailAsync(EmailData data, CancellationToken cancellationToken = default)
    {
        var apiToken = JsonConvert.DeserializeObject<ApiKey>(await SecretAccesor.GetSecretAsync(secretName))?.Token;
        _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {apiToken}");

        var response = await _httpClient.PostAsJsonAsync(
            sendEmailPath,
            data,
            cancellationToken);
        
        var responseContent = await response.Content.ReadAsStringAsync(cancellationToken);

        //TODO TEMP
        var jsonData = JsonSerializer.Serialize(data);

        return Result.FromBool(
            response.IsSuccessStatusCode,
            CreateResendResponseError(data.To, responseContent, jsonData));
    }

    private static Error CreateResendResponseError(string[] recipient, object errorMessage, string data) => new(
        "ResendClient.EmailSendError",
        $"""
          Problem while sending an email to {JsonConvert.SerializeObject(recipient)}.
          Request: {data}
          Response: {JsonConvert.SerializeObject(errorMessage)}.
          """);
}