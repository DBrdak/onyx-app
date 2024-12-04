using Abstractions.Messaging;
using Identity.Application.Contracts.Models;

namespace Identity.Application.Auth.GoogleCallback;

public sealed record GoogleCallbackCommand(string? Code, string? Origin) : ICommand<UserModel>;
