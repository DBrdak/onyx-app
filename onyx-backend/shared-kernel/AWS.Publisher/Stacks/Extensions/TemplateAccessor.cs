using AWS.Publisher.Stacks.Abstractions;

namespace AWS.Publisher.Stacks.Extensions;

internal static class TemplateAccessor
{
    public static async Task<string> GetTemplateFileAsync(this Stack stack) =>
        string.IsNullOrWhiteSpace(stack.PackagedTemplatePath) ?
            await File.ReadAllTextAsync(stack.TemplatePath) :
            await File.ReadAllTextAsync(stack.PackagedTemplatePath);
}