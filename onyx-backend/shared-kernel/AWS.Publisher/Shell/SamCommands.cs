using AWS.Publisher.Configurations;

namespace AWS.Publisher.Shell;

internal static class SamCommands
{
    public static Command BuildTemplate(string templatePath) =>
        new($"sam build --template {templatePath}");

    public static Command PackageTemplate(string packagedTemplatePath) =>
        new($"sam package --s3-bucket {AwsSpecs.S3Bucket} --output-template-file {packagedTemplatePath}");
}