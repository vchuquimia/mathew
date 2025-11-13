using mathew.entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace mathew.api.Controllers;

[ApiController]
[Route("[controller]")]
public class BudgetController : ControllerBase
{
    [HttpGet("{year:int}/{period:int}")]
    public async Task<List<Budget>> Get(ExpenseDbContext context, int year, int period, string? userName)
    {
        return await context.Budgets
            .Where(b => b.Year == year && b.Month == period && (b.UserName == userName || userName == null))
            .Include(i=> i.Category).ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<Budget>> Create(ExpenseDbContext context, Budget budget)
    {
        budget.CategoryId = budget.Category.Id;
        budget.Category = null;
        if (budget.Id == 0)
        {
            context.Budgets.Add(budget);
        }
        else
        {
            context.Budgets.Update(budget);
        }

        await context.SaveChangesAsync();
        return budget;
    }

    [HttpDelete]
    public async Task<int> DeleteBudget(ExpenseDbContext context, Budget budget)
    {
        context.Budgets.Remove(budget);
        return await context.SaveChangesAsync();
    }

    [HttpPost("copy")]
    public async Task<ActionResult<int>> CopyBudgetsAsync(
        ExpenseDbContext context,
        [FromBody] BudgetCopyParameter budgetCopy )
    {
        // Get source budgets
        var sourceBudgets = await context.Budgets
            .Where(b => b.Month == budgetCopy.SourceMonth && b.Year == budgetCopy.SourceYear)
            .AsNoTracking()
            .ToListAsync();

        if (!sourceBudgets.Any())
        {
            throw new InvalidOperationException(
                $"No budgets found for {budgetCopy.SourceMonth}/{budgetCopy.SourceYear}");
        }

        // Check if target budgets already exist
        var existingTargetBudgets = await context.Budgets
            .Where(b => b.Month == budgetCopy.TargetMonth && b.Year == budgetCopy.TargetYear)
            .ToListAsync();

        if (existingTargetBudgets.Any() && !budgetCopy.OverwriteExisting)
        {
            throw new InvalidOperationException(
                $"Budgets already exist for {budgetCopy.TargetMonth}/{budgetCopy.TargetYear}. " +
                "Set OverwriteExisting to true to replace them.");
        }

        // Remove existing target budgets if overwriting
        if (budgetCopy.OverwriteExisting && existingTargetBudgets.Any())
        {
            context.Budgets.RemoveRange(existingTargetBudgets);
        }

        // Create new budgets for a target month / year
        var newBudgets = sourceBudgets.Select(sb => new Budget
        {
            CategoryId = sb.CategoryId,
            Amount = sb.Amount,
            Month = budgetCopy.TargetMonth,
            Year = budgetCopy.TargetYear,
            UserName = sb.UserName
        }).ToList();

        await context.Budgets.AddRangeAsync(newBudgets);
        return await context.SaveChangesAsync();
    }

}