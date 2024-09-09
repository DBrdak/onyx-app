using Amazon.CloudFormation;
using Amazon.Runtime;
using Amazon.Runtime.CredentialManagement;
using Microsoft.Extensions.DependencyInjection;
using Amazon;
using AWS.Publisher.Configurations;
using static AWS.Publisher.Terminal.Printer;
using Amazon.S3;
using AWS.Publisher.Stacks;

namespace AWS.Publisher;

internal class Program
{
    static async Task Main(string[] args)
    {
        var env = CurrentEnvironment.SetCurrentEnvironment(args);

        var serviceProvider = ConfigureServices(env);
        var appBuilder = serviceProvider.GetRequiredService<AppBuilder>();

        await appBuilder.BuildAwsApplication();
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
        services.AddSingleton(new StackRegistry());

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
        Environment.Exit(1);
        return null;
    }
}