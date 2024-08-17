using Amazon.Lambda.Annotations.APIGateway;
using Amazon.Lambda.Annotations;
using Budget.Application.Categories.AddCategory;
using Budget.Application.Categories.GetCategories;
using Budget.Application.Categories.RemoveCategory;
using Budget.Application.Categories.UpdateCategory;
using Budget.Functions.Functions.Categories.Requests;
using Budget.Functions.Functions.Shared;
using MediatR;
using Amazon.Lambda.APIGatewayEvents;
using Amazon.Lambda.Core;
using LambdaKernel;


namespace Budget.Functions.Functions.Categories;

//TODO: Add query for GET to load assignments only for month
public sealed class CategoryFunctions : BaseFunction
{
    private const string categoriesBaseRoute = $"{BaseRouteV1}/{{budgetId}}/categories";

    public CategoryFunctions(ISender sender, IServiceProvider serviceProvider) : base(sender, serviceProvider)
    {
    }

    [LambdaFunction(ResourceName = $"Categories{nameof(GetAll)}")]
    [HttpApi(LambdaHttpMethod.Get, categoriesBaseRoute)]
    public async Task<APIGatewayHttpApiV2ProxyResponse> GetAll(
        string budgetId,
        APIGatewayHttpApiV2ProxyRequest requestContext,
        ILambdaContext lambdaContext)
    {
        ServiceProvider?.AddRequestContextAccessor(requestContext, lambdaContext);

        var query = new GetCategoriesQuery(Guid.Parse(budgetId));

        var result = await Sender.Send(query);

        return result.ReturnAPIResponse(200, 404);
    }

    [LambdaFunction(ResourceName = $"Categories{nameof(Add)}")]
    [HttpApi(LambdaHttpMethod.Post, categoriesBaseRoute)]
    public async Task<APIGatewayHttpApiV2ProxyResponse> Add(
        string budgetId,
        [FromBody] AddCategoryRequest request,
        APIGatewayHttpApiV2ProxyRequest requestContext)
    {
        ServiceProvider?.AddRequestContextAccessor(requestContext);

        var command = new AddCategoryCommand(request.Name, Guid.Parse(budgetId));

        var result = await Sender.Send(command);

        return result.ReturnAPIResponse();
    }

    [LambdaFunction(ResourceName = $"Categories{nameof(Update)}")]
    [HttpApi(LambdaHttpMethod.Put, $"{categoriesBaseRoute}/{{categoryId}}")]
    public async Task<APIGatewayHttpApiV2ProxyResponse> Update(
        string budgetId,
        string categoryId,
        [FromBody] UpdateCategoryRequest request,
        APIGatewayHttpApiV2ProxyRequest requestContext)
    {
        ServiceProvider?.AddRequestContextAccessor(requestContext);

        var command = new UpdateCategoryCommand(
            Guid.Parse(categoryId),
            request.NewName,
            Guid.Parse(budgetId));

        var result = await Sender.Send(command);

        return result.ReturnAPIResponse();
    }

    [LambdaFunction(ResourceName = $"Categories{nameof(Remove)}")]
    [HttpApi(LambdaHttpMethod.Delete, $"{categoriesBaseRoute}/{{categoryId}}")]
    public async Task<APIGatewayHttpApiV2ProxyResponse> Remove(
        string budgetId,
        string categoryId,
        APIGatewayHttpApiV2ProxyRequest requestContext)
    {
        ServiceProvider?.AddRequestContextAccessor(requestContext);

        var command = new RemoveCategoryCommand(Guid.Parse(categoryId), Guid.Parse(budgetId));

        var result = await Sender.Send(command);

        return result.ReturnAPIResponse();
    }
}