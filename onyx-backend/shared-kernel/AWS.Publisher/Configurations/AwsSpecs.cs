using Amazon;

namespace AWS.Publisher.Configurations;

internal static class AwsSpecs
{
    public const string Profile = "dbrdak-lambda";
    public static readonly RegionEndpoint Region = RegionEndpoint.EUCentral1;
    public const string S3Bucket = "onyx-default";
}