using Abstractions.Messaging;
using Budget.Application.Abstractions.Identity;
using Budget.Domain.Budgets;
using Budget.Domain.Budgets.DomainEvents;
using Budget.Domain.Categories;
using Budget.Domain.Subcategories;
using Models.Responses;
using MongoDB.Bson;

namespace Budget.Application.Budgets.AddBudget.DomainEventHandlers;

internal sealed class BudgetCreatedDomainEventHandler : IDomainEventHandler<BudgetCreatedDomainEvent>
{
    private readonly ICategoryRepository _categoryRepository;
    private readonly ISubcategoryRepository _subcategoryRepository;
    private readonly IBudgetRepository _budgetRepository;
    private const string initCategoryName = "Uncategorized";
    private const string initSubcategoryName = "Unknown";

    public BudgetCreatedDomainEventHandler(
        ISubcategoryRepository subcategoryRepository,
        ICategoryRepository categoryRepository,
        IBudgetRepository budgetRepository)
    {
        _subcategoryRepository = subcategoryRepository;
        _categoryRepository = categoryRepository;
        _budgetRepository = budgetRepository;
    }

    public async Task Handle(BudgetCreatedDomainEvent notification, CancellationToken cancellationToken)
    {
        var budget = notification.Budget;

        var initialCategory = Category.Create(initCategoryName, budget.Id).Value;
        var initialSubcategory = initialCategory.NewSubcategory(initSubcategoryName).Value;
        budget.Setup(initialCategory, initialSubcategory);

        await Task.WhenAll(
        [
            _categoryRepository.AddAsync(initialCategory, cancellationToken),
            _subcategoryRepository.AddAsync(initialSubcategory, cancellationToken),
            _budgetRepository.UpdateAsync(budget, cancellationToken)
        ]);
    }
}