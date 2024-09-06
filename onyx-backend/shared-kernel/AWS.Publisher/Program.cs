using Amazon.CloudFormation;
using Amazon.Runtime;
using Amazon.Runtime.CredentialManagement;
using Amazon.Util;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using System.Net;
using Amazon;
using AWS.Publisher.Configurations;
using static AWS.Publisher.Terminal.Printer;
using Amazon.S3;

namespace AWS.Publisher;

internal class Program
{
    static async Task Main(string[] args)
    {
        var env = CurrentEnvironment.SetCurrentEnvironment(args);

        var serviceProvider = ConfigureServices(env);
        var appBuilder = serviceProvider.GetRequiredService<AppBuilder>();

        await appBuilder.BuildAWSApplication();
    }

    private static ServiceProvider ConfigureServices(CurrentEnvironment env)
    {
        var services = new ServiceCollection();
        var creds = GetAWSCredentialsFromProfile();

        services.AddSingleton(env);
        services.AddSingleton<AppBuilder>();
        services.AddSingleton(new AmazonCloudFormationClient(creds, RegionEndpoint.EUCentral1));
        services.AddSingleton(new AmazonS3Client(creds, RegionEndpoint.EUCentral1));
        services.AddSingleton<CloudFormation.Publisher>();

        return services.BuildServiceProvider();
    }
    private static AWSCredentials GetAWSCredentialsFromProfile()
    {
        var chain = new CredentialProfileStoreChain();

        if (chain.TryGetAWSCredentials(AwsSpecs.Profile, out var awsCredentials))
        {
            return awsCredentials;
        }

        PrintLine($"Could not load credentials for profile {AwsSpecs.Profile}", ConsoleColor.Red);
        throw new Exception();
    }
}