using System.Net.Http.Json;
using System.Text.Json;
using Messanger.Lambda.Models;
using Models.Responses;
using Newtonsoft.Json;
using SharedDAL.SecretsManager;

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
            new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            },
            cancellationToken);
        
        var responseContent = await response.Content.ReadAsStringAsync(cancellationToken);

        return Result.FromBool(
            response.IsSuccessStatusCode,
            CreateResendResponseError(data.To, responseContent));
    }

    private static Error CreateResendResponseError(string[] recipient, object errorMessage) => new(
        "ResendClient.EmailSendError",
        $"""
          Problem while sending an email to {JsonConvert.SerializeObject(recipient)}.
          Response: {JsonConvert.SerializeObject(errorMessage)}.
          """);
}