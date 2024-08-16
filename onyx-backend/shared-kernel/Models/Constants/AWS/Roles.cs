namespace Models.Constants.AWS;

public static class Roles
{
    public static readonly string LambdaSQSAccessName = 
        nameof(LambdaSQSAccessName).Replace("Name", string.Empty);

    public static readonly string FullAccessName = 
        nameof(FullAccessName).Replace("Name", string.Empty);
}