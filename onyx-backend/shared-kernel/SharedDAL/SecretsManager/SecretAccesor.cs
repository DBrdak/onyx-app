using Amazon;
using Amazon.SecretsManager;
using Amazon.SecretsManager.Model;

namespace SharedDAL.SecretsManager;

public class SecretAccesor
{
    public static string GetSecret(string secretName)
    {
        const string region = "eu-central-1";

        var client = new AmazonSecretsManagerClient(RegionEndpoint.GetBySystemName(region));

        var request = new GetSecretValueRequest
        {
            SecretId = secretName,
            VersionStage = "AWSCURRENT"
        };

        var response = client.GetSecretValueAsync(request).Result;

        return response.SecretString;
    }

    public static async Task<string> GetSecretAsync(string secretName)
    {
        const string region = "eu-central-1";

        var client = new AmazonSecretsManagerClient(RegionEndpoint.GetBySystemName(region));

        var request = new GetSecretValueRequest
        {
            SecretId = secretName,
            VersionStage = "AWSCURRENT"
        };

        var response = await client.GetSecretValueAsync(request);

        return response.SecretString;
    }
}