using mathew.entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace mathew.api.Controllers;

[ApiController]
[Route("[controller]")]
public class BudgetController : ControllerBase
{
    [HttpGet("{year:int}/{period:int}")]
    public async Task<List<Budget>> Get(ExpenseDbContext context, int year, int period, int familyId, string? userName = null)
    {
        return await context.Budgets
            .Where(b => b.Year == year && b.Month == period 
                && b.FamilyId == familyId
                && (b.UserName == userName || userName == null))
            .Include(i=> i.Category).ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<Budget>> Create(ExpenseDbContext context, Budget budget)
    {
        budget.CategoryId = budget.Category.Id;
        budget.Category = null;
        
        // Validate FamilyId is set
        if (budget.FamilyId == 0)
            return BadRequest("FamilyId is required");

        if (budget.Id == 0)
        {
            context.Budgets.Add(budget);
        }
        else
        {
            // Verify the budget belongs to the specified family
            var existingBudget = await context.Budgets
                .FirstOrDefaultAsync(b => b.Id == budget.Id && b.FamilyId == budget.FamilyId);
            if (existingBudget == null)
                return Forbid("Budget does not belong to your family");
            
            context.Budgets.Update(budget);
        }

        await context.SaveChangesAsync();
        return budget;
    }

    [HttpDelete]
    public async Task<ActionResult<int>> DeleteBudget(ExpenseDbContext context, Budget budget)
    {
        // Validate FamilyId is set
        if (budget.FamilyId == 0)
            return BadRequest("FamilyId is required");

        var existingBudget = await context.Budgets
            .FirstOrDefaultAsync(b => b.Id == budget.Id && b.FamilyId == budget.FamilyId);
        if (existingBudget == null)
            return Forbid("Budget does not belong to your family");

        context.Budgets.Remove(budget);
        return await context.SaveChangesAsync();
    }

    [HttpPost("copy")]
    public async Task<ActionResult<int>> CopyBudgetsAsync(
        ExpenseDbContext context,
        [FromBody] BudgetCopyParameter budgetCopy)
    {
        // Validate FamilyId is set
        if (budgetCopy.FamilyId == 0)
            return BadRequest("FamilyId is required");

        // Get source budgets filtered by family
        var sourceBudgets = await context.Budgets
            .Where(b => b.Month == budgetCopy.SourceMonth 
                && b.Year == budgetCopy.SourceYear
                && b.FamilyId == budgetCopy.FamilyId)
            .AsNoTracking()
            .ToListAsync();

        if (!sourceBudgets.Any())
        {
            throw new InvalidOperationException(
                $"No budgets found for {budgetCopy.SourceMonth}/{budgetCopy.SourceYear}");
        }

        // Check if target budgets already exist (filtered by family)
        var existingTargetBudgets = await context.Budgets
            .Where(b => b.Month == budgetCopy.TargetMonth 
                && b.Year == budgetCopy.TargetYear
                && b.FamilyId == budgetCopy.FamilyId)
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
            UserName = sb.UserName,
            FamilyId = budgetCopy.FamilyId
        }).ToList();

        await context.Budgets.AddRangeAsync(newBudgets);
        return await context.SaveChangesAsync();
    }

}