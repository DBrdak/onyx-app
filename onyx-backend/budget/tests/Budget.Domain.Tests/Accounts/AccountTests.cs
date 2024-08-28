using Budget.Domain.Accounts;

namespace Budget.Domain.Tests.Accounts;

public sealed class AccountTests
{
    [Fact]
    public void Create_Should_Success()
    {
        // Act
        var account = Account.Create();
    }
}