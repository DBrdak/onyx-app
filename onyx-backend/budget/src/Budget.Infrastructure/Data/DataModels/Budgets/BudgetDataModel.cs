﻿using System.Reflection;
using Amazon.DynamoDBv2.DocumentModel;
using Budget.Domain.Budgets;
using Budget.Domain.Subcategories;
using Models.Primitives;
using SharedDAL.DataModels;
using SharedDAL.DataModels.Abstractions;
using SharedDAL.Extensions;

namespace Budget.Infrastructure.Data.DataModels.Budgets;

internal sealed class BudgetDataModel : IDataModel<Domain.Budgets.Budget>
{
    public Guid Id { get; init; }
    public string Name { get; init; }
    public string BaseCurrency { get; init; }
    public string? InvitationTokenValue { get; init; }
    public int? InvitationTokenExpirationDateDay { get; init; }
    public int? InvitationTokenExpirationDateMonth { get; init; }
    public int? InvitationTokenExpirationDateYear { get; init; }
    public int? InvitationTokenExpirationDateHour { get; init; }
    public int? InvitationTokenExpirationDateMinute { get; init; }
    public int? InvitationTokenExpirationDateSecond { get; init; }
    public IEnumerable<string> BudgetMembersId { get; init; }
    public IEnumerable<BudgetMemberDataModel> BudgetMembers { get; init; }
    public Guid? UnknownSubcategoryId { get; init; }
    public long CreatedAt { get; init; }

    private BudgetDataModel(Document doc)
    {
        Id = Guid.Parse(doc[nameof(Id)].AsString());
        Name = doc[nameof(Name)];
        BaseCurrency = doc[nameof(BaseCurrency)];
        BudgetMembers = doc[nameof(BudgetMembers)]
            .AsDynamoDBList().Entries
            .Select(entry => BudgetMemberDataModel.FromDocument(entry.AsDocument()));
        InvitationTokenValue = doc[nameof(InvitationTokenValue)].AsNullableString();
        InvitationTokenExpirationDateDay = doc[nameof(InvitationTokenExpirationDateDay)].AsNullableInt();
        InvitationTokenExpirationDateMonth = doc[nameof(InvitationTokenExpirationDateMonth)].AsNullableInt();
        InvitationTokenExpirationDateYear = doc[nameof(InvitationTokenExpirationDateYear)].AsNullableInt();
        InvitationTokenExpirationDateHour = doc[nameof(InvitationTokenExpirationDateHour)].AsNullableInt();
        InvitationTokenExpirationDateMinute = doc[nameof(InvitationTokenExpirationDateMinute)].AsNullableInt();
        InvitationTokenExpirationDateSecond = doc[nameof(InvitationTokenExpirationDateSecond)].AsNullableInt();
        UnknownSubcategoryId = doc[nameof(UnknownSubcategoryId)].AsNullableGuid();
        BudgetMembersId = doc[nameof(BudgetMembersId)].AsArrayOfString();
        CreatedAt = doc[nameof(CreatedAt)].AsLong();
    }


    private BudgetDataModel(Domain.Budgets.Budget budget)
    {
        var invitationTokenExpirationDate = budget.InvitationToken?.ExpirationDate.ToUniversalTime();

        Id = budget.Id.Value;
        Name = budget.Name.Value;
        BaseCurrency = budget.BaseCurrency.Code;
        BudgetMembers = budget.BudgetMembers.Select(BudgetMemberDataModel.FromDomainModel);
        InvitationTokenValue = budget.InvitationToken?.Value;
        (
            InvitationTokenExpirationDateDay,
            InvitationTokenExpirationDateMonth,
            InvitationTokenExpirationDateYear,
            InvitationTokenExpirationDateHour,
            InvitationTokenExpirationDateMinute,
            InvitationTokenExpirationDateSecond
        ) = 
        (
            invitationTokenExpirationDate?.Day,
            invitationTokenExpirationDate?.Month,
            invitationTokenExpirationDate?.Year,
            invitationTokenExpirationDate?.Hour,
            invitationTokenExpirationDate?.Minute,
            invitationTokenExpirationDate?.Second
        );
        UnknownSubcategoryId = budget.UnknownSubcategoryId?.Value;
        BudgetMembersId = budget.BudgetMembers.Select(bm => bm.Id);
        CreatedAt = budget.CreatedAt;
    }

    public static BudgetDataModel FromDomainModel(Domain.Budgets.Budget budget) => new(budget);

    public Type GetDomainModelType() => typeof(Domain.Budgets.Budget);

    public Domain.Budgets.Budget ToDomainModel()
    {
        object? invitationToken = null;

        var id = new BudgetId(Id);

        var name = Activator.CreateInstance(
                       typeof(BudgetName),
                       BindingFlags.Instance | BindingFlags.NonPublic,
                       null,
                       [Name],
                       null) ??
                   throw new DataModelConversionException(
                       typeof(string),
                       typeof(BudgetName),
                       typeof(BudgetDataModel));

        var baseCurrency = Activator.CreateInstance(
                               typeof(Currency),
                               BindingFlags.Instance | BindingFlags.NonPublic,
                               null,
                               [BaseCurrency],
                               null) ??
                           throw new DataModelConversionException(
                               typeof(string),
                               typeof(Currency),
                               typeof(BudgetDataModel));

        if (InvitationTokenExpirationDateYear is not null &&
        InvitationTokenExpirationDateMonth is not null &&
        InvitationTokenExpirationDateDay is not null &&
        InvitationTokenExpirationDateHour is not null &&
        InvitationTokenExpirationDateMinute is not null &&
        InvitationTokenExpirationDateSecond is not null)
        {
            var invitationTokenExpirationDate = new DateTime(
                InvitationTokenExpirationDateYear.Value,
                InvitationTokenExpirationDateMonth.Value,
                InvitationTokenExpirationDateDay.Value,
                InvitationTokenExpirationDateHour.Value,
                InvitationTokenExpirationDateMinute.Value,
                InvitationTokenExpirationDateSecond.Value
            );

            invitationToken = Activator.CreateInstance(
                                      typeof(BudgetInvitationToken),
                                      BindingFlags.Instance | BindingFlags.NonPublic,
                                      null,
                                      [
                                          InvitationTokenValue,
                                          invitationTokenExpirationDate
                                      ],
                                      null) ??
                                  throw new DataModelConversionException(
                                      typeof(string),
                                      typeof(BudgetInvitationToken),
                                      typeof(BudgetDataModel));
        }

        var budgetMembers = BudgetMembers.Select(bm => bm.ToDomainModel()).ToList();

        var unkownSubcategoryId =
            UnknownSubcategoryId is null ? null : new SubcategoryId(UnknownSubcategoryId.Value);

        return Activator.CreateInstance(
                   typeof(Domain.Budgets.Budget),
                   BindingFlags.Instance | BindingFlags.NonPublic,
                   null,
                   [
                       name,
                       baseCurrency,
                       budgetMembers,
                       invitationToken,
                       unkownSubcategoryId,
                       id,
                       CreatedAt
                   ],
                   null) as Domain.Budgets.Budget ??
               throw new DataModelConversionException(
                   typeof(BudgetDataModel),
                   typeof(Domain.Budgets.Budget));
    }

    public static BudgetDataModel FromDocument(Document doc) => new(doc);
}