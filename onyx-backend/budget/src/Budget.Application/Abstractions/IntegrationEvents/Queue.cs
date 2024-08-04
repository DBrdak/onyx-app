using Models.Responses;

namespace Budget.Application.Abstractions.IntegrationEvents;

public record Queue
{
    public string Name { get; init; }

    private Queue(string name) => (Name) = (name);

    private readonly Queue[] _all = 
    [
    ];

    public Result<Queue> FromString(string name) =>
        _all.FirstOrDefault(topic => topic.Name.ToLower() == name.ToLower());

}