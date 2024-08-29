using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Models.DataTypes;

namespace Budget.Domain.Tests.Budgets;

public sealed class BudgetData
{
    public static string ValidName = "Test-Budget 1";
    public static string NewValidName = "Test-Budget 2";
    public static string UserId = Guid.NewGuid().ToString();
    public static string NewUserId = Guid.NewGuid().ToString();
    public static string Username = "testUser";
    public static string NewUsername = "testUser2";
    public static string Email = "test@test.com";
    public static string NewEmail = "test2@test.com";
    public static string CurrencyCode = Currency.Usd.Code;
    public static string InvalidName = "*Test_Budget;1!";
    public static string InvalidInvitationToken = "anyting";
    public static Domain.Budgets.Budget Budget = Domain.Budgets.Budget.Create(
        ValidName,
        UserId,
        Username,
        Email,
        CurrencyCode).Value;
    public static Domain.Budgets.Budget BudgetCopy = Domain.Budgets.Budget.Create(
        ValidName,
        UserId,
        Username,
        Email,
        CurrencyCode).Value;
}