﻿using Amazon.Lambda.Annotations;
using Amazon.Lambda.Annotations.APIGateway;
using Amazon.Lambda.Core;
using Budget.Application.Accounts.AddAccount;
using Budget.Application.Accounts.GetAccounts;
using Budget.Application.Accounts.RemoveAccount;
using Budget.Application.Accounts.UpdateAccount;
using Budget.Functions.Functions.Accounts.Requests;
using Budget.Functions.Functions.Shared;
using MediatR;
using Models.Responses;

namespace Budget.Functions.Functions.Accounts;

public sealed class AccountFunctions : BaseFunction
{
    private const string baseRoute = $"{BaseRouteV1}{{budgetId}}/accounts/";

    public AccountFunctions(ISender sender) : base(sender)
    {
        
    }

    [LambdaFunction(Role = FullAccessRole)]
    [HttpApi(LambdaHttpMethod.Get, baseRoute)]
    public async Task<Result> GetAll(string budgetId)
    {
        var query = new GetAccountsQuery(Guid.Parse(budgetId));

        var result = await Sender.Send(query);

        return result;
    }

    [LambdaFunction(Role = FullAccessRole)]
    [HttpApi(LambdaHttpMethod.Post, baseRoute)]
    public async Task<Result> Add(
        string budgetId,
        [FromBody] AddAccountRequest request)
    {
        var command = new AddAccountCommand(request.Name, request.Balance, request.AccountType, Guid.Parse(budgetId));

        var result = await Sender.Send(command);

        return result;
    }

    [LambdaFunction(Role = FullAccessRole)]
    [HttpApi(LambdaHttpMethod.Put, $"{baseRoute}{{accountId}}")]
    public async Task<Result> Update(
        string budgetId,
        string accountId,
        [FromBody] UpdateAccountRequest request)
    {
        var command = new UpdateAccountCommand(Guid.Parse(accountId), request.NewName, request.NewBalance, Guid.Parse(budgetId));

        var result = await Sender.Send(command);

        return result;
    }

    [LambdaFunction(Role = FullAccessRole)]
    [HttpApi(LambdaHttpMethod.Delete, $"{baseRoute}{{accountId}}")]
    public async Task<Result> Remove(
        string budgetId,
        string accountId)
    {
        var command = new RemoveAccountCommand(Guid.Parse(accountId), Guid.Parse(budgetId));

        var result = await Sender.Send(command);

        return result;
    }
}