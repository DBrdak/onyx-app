using Amazon.S3;
using Amazon.S3.Model;
using Models.Responses;

namespace SharedDAL.S3;

public sealed class S3Accessor
{
    private static readonly IAmazonS3 s3Client = new AmazonS3Client();
    private const string bucketName = "onyx-default";
    private const string region = "eu-central-1";

    public static async Task<string> DownloadObjectAsync(string objectName)
    {
        var request = new GetObjectRequest
        {
            BucketName = bucketName,
            Key = objectName
        };

        using var response = await s3Client.GetObjectAsync(request);
        var path = $"{objectName}-{Guid.NewGuid()}";
        await response.WriteResponseStreamToFileAsync(path, false, CancellationToken.None);

        return path;
    }

    public static async Task<string> GetPlainTextAsync(string objectName)
    {
        var request = new GetObjectRequest
        {
            BucketName = bucketName,
            Key = objectName
        };

        using var response = await s3Client.GetObjectAsync(request);
        var path = $"{objectName}-{Guid.NewGuid()}";
        await response.WriteResponseStreamToFileAsync(path, false, CancellationToken.None);
        using var reader = new StreamReader(path);
        var content = await reader.ReadToEndAsync();
        File.Delete(path);

        return content;
    }

    public static string GetObjectUrl(string objectName) =>
        $"https://{bucketName}.s3.{region}.amazonaws.com/{objectName}";

    public static async Task<Result<string>> TryGetObjectUrlAsync(string objectName)
    {
        var request = new GetObjectRequest
        {
            BucketName = bucketName,
            Key = objectName
        };

        try
        {
            using var response = await s3Client.GetObjectAsync(request);
            return GetObjectUrl(objectName);
        }
        catch (Exception)
        {
            return new Error("File.NotFound", $"File with name {objectName} does not exist");
        }
    }
}