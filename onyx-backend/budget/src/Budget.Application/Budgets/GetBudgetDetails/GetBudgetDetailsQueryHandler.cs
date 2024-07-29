using Abstractions.Messaging;
using Budget.Application.Abstractions.Identity;
using Budget.Application.Accounts.Models;
using Budget.Application.Budgets.Models;
using Budget.Application.Categories.Models;
using Budget.Application.Counterparties.Models;
using Budget.Domain.Accounts;
using Budget.Domain.Budgets;
using Budget.Domain.Categories;
using Budget.Domain.Counterparties;
using Budget.Domain.Subcategories;
using Models.Responses;

namespace Budget.Application.Budgets.GetBudgetDetails;

internal sealed class GetBudgetDetailsQueryHandler : IQueryHandler<GetBudgetDetailsQuery, BudgetModel>
{
    private readonly IBudgetRepository _budgetRepository;
    private readonly IAccountRepository _accountRepository;
    private readonly ICounterpartyRepository _counterpartyRepository;
    private readonly ICategoryRepository _categoryRepository;
    private readonly ISubcategoryRepository _subcategoryRepository;
    private readonly IUserContext _userContext;

    public GetBudgetDetailsQueryHandler(
        IBudgetRepository budgetRepository,
        ICounterpartyRepository counterpartyRepository,
        IAccountRepository accountRepository,
        ICategoryRepository categoryRepository,
        ISubcategoryRepository subcategoryRepository,
        IUserContext userContext)
    {
        _budgetRepository = budgetRepository;
        _counterpartyRepository = counterpartyRepository;
        _accountRepository = accountRepository;
        _categoryRepository = categoryRepository;
        _subcategoryRepository = subcategoryRepository;
        _userContext = userContext;
    }

    public async Task<Result<BudgetModel>> Handle(GetBudgetDetailsQuery request, CancellationToken cancellationToken)
    {
        var userIdGetResult = _userContext.GetUserId();

        if (userIdGetResult.IsFailure)
        {
            return userIdGetResult.Error;
        }

        var budgetId = new BudgetId(request.BudgetId);

        var budgetGetResult = await _budgetRepository.GetBudgetsForUserAsync(userIdGetResult.Value, cancellationToken);

        if (budgetGetResult.IsFailure)
        {
            return budgetGetResult.Error;
        }

        var budget = budgetGetResult.Value.FirstOrDefault(b => b.Id == budgetId);

        if (budget is null)
        {
            return Error.NotFound(typeof(Domain.Budgets.Budget));
        }

        var (accountsTask, categoriesTask, counterpartiesTask, subcategoriesTask) = (
            _accountRepository.GetAllAsync(cancellationToken),
            _categoryRepository.GetAllAsync(cancellationToken),
            _counterpartyRepository.GetAllAsync(cancellationToken),
            _subcategoryRepository.GetAllAsync(cancellationToken)
        );

        await Task.WhenAll(accountsTask, categoriesTask, counterpartiesTask, subcategoriesTask);

        if (Result.Aggregate(
            [
                accountsTask.Result,
                categoriesTask.Result,
                counterpartiesTask.Result,
                subcategoriesTask.Result
            ]) is { IsFailure: true } result)
        {
            return result.Error;
        }

        var (accounts, categories, counterparties, subcategories) = (
            accountsTask.Result.Value,
            categoriesTask.Result.Value,
            counterpartiesTask.Result.Value,
            subcategoriesTask.Result.Value
        );

        var (categoryModels, accountModels, counterpartyModels) = (
            categories.Select(category => CategoryModel.FromDomainModel(category, subcategories)),
            accounts.Select(AccountModel.FromDomainModel),
            counterparties.Select(CounterpartyModel.FromDomainModel)
        );

        return BudgetModel.FromDomainModel(budget, categoryModels, accountModels, counterpartyModels);
    }
}