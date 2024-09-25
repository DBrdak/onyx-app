using System.Text.Json.Serialization;
using Abstractions.Messaging;
using Newtonsoft.Json;

namespace Abstractions.DomainBaseTypes;

public abstract class Entity<TEntityId> : IEntity where TEntityId : EntityId, new()
{
    [JsonProperty("id")]
    [JsonPropertyName("id")]
    public TEntityId Id { get; protected set; }

    public long CreatedAt { get; init; }

    private readonly List<IDomainEvent> _domainEvents = new();

    protected Entity()
    {
        Id = new TEntityId();
        CreatedAt = DateTime.UtcNow.Ticks;
    }

    protected Entity(TEntityId id)
    {
        Id = id;
        _domainEvents = new();
        CreatedAt = DateTime.UtcNow.Ticks;
    }

    protected Entity(TEntityId id, long? createdAt)
    {
        Id = id;
        _domainEvents = new();
        CreatedAt = createdAt ?? DateTime.UtcNow.Ticks;
    }

    [System.Text.Json.Serialization.JsonConstructor]
    [Newtonsoft.Json.JsonConstructor]
    private Entity(TEntityId id, List<IDomainEvent> domainEvents, long createdAt)
    {
        Id = id;
        _domainEvents = domainEvents;
        CreatedAt = createdAt;
    }

    public IReadOnlyList<IDomainEvent> GetDomainEvents() =>
        _domainEvents;

    public void ClearDomainEvents() =>
        _domainEvents.Clear();

    protected void RaiseDomainEvent(IDomainEvent domainEvent) =>
        _domainEvents.Add(domainEvent);
}