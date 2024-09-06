using Amazon;
using Amazon.Internal;
using Amazon.Runtime;

namespace AWS.Publisher.Configurations;

internal static class AwsSpecs
{
    public const string Profile = "dbrdak-lambda";
    public static readonly RegionEndpoint Region = RegionEndpoint.EUCentral1;
}