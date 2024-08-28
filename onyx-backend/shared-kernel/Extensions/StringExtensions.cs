using System.Text.RegularExpressions;

namespace Extensions;

public static class StringExtensions
{
    private const string urlPattern =
        "\\b((http|https):\\/\\/)?(([\\w\\-]+(\\.[\\w\\-]+)+)|localhost)(:\\d+)?(\\/[\\w\\-.,@?^=%&:\\/~+#]*)?\\b\r\n";

    public static bool IsUrl(this string url) => Regex.IsMatch(url, urlPattern);
}