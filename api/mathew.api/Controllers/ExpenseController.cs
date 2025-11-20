using mathew.entities;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace mathew.api.Controllers;



[ApiController]
[Route("[controller]")]
[EnableCors]
public class ExpenseController : ControllerBase
{
    [HttpGet("{year:int}/{month:int}")]
    public async Task<List<Expense>> SendCommand(ExpenseDbContext context, int year, int month, int familyId, string? registeredBy = null)
    {
        return await context.Expenses
            .Where(i=> (i.RegisteredBy == registeredBy || registeredBy == null)
                       && i.Date.Year == year && i.Date.Month == month
                       && i.FamilyId == familyId)
            .Include(i=> i.Category)
            .OrderByDescending(i=> i.Date)
            .ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<Expense>> CreateCategory(ExpenseDbContext context, Expense expense)
    {
        expense.CategoryId = expense.Category.Id;
        expense.Category = null;
        
        // Validate FamilyId is set
        if (expense.FamilyId == 0)
            return BadRequest("FamilyId is required");

        if (expense.Id == 0)
        {
            context.Expenses.Add(expense);
        }
        else
        {
            // Verify the expense belongs to the specified family
            var existingExpense = await context.Expenses
                .FirstOrDefaultAsync(e => e.Id == expense.Id && e.FamilyId == expense.FamilyId);
            if (existingExpense == null)
                return Forbid("Expense does not belong to your family");
            
            context.Expenses.Update(expense);
        }

        await context.SaveChangesAsync();
        return expense;
    }

    [HttpDelete]
    public async Task<ActionResult<int>> DeleteExpense(ExpenseDbContext context, Expense expense)
    {
        // Validate FamilyId is set
        if (expense.FamilyId == 0)
            return BadRequest("FamilyId is required");


        context.Expenses.Remove(expense);
        return await context.SaveChangesAsync();
    }

    [HttpGet("by-date-category/{startDate:datetime}/{endDate:datetime}/{categoryId:int}")]
    public async Task<List<Expense>> ByDateAndCategory(ExpenseDbContext context, DateTime startDate, DateTime endDate, int categoryId, int familyId)
    {
        return await context.Expenses
            .Where(i => i.Date >= startDate.Date 
                && i.Date <= endDate.Date 
                && i.CategoryId == categoryId
                && i.FamilyId == familyId)
            .Include(i=> i.Category)
            .OrderByDescending(i=> i.Date)
            .ToListAsync();
    }
}