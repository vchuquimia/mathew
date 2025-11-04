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
    [HttpGet("")]
    public async Task<List<Expense>> SendCommand(ExpenseDbContext context)
    {
        return await context.Expenses
            .Include(i=> i.Category)
            .OrderByDescending(i=> i.Date)
            .ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<Expense>> CreateCategory(ExpenseDbContext context, Expense expense)
    {
        // context.Attach(expense.Category);
        expense.CategoryId = expense.Category.Id;
        expense.Category = null;
        if (expense.Id == 0)
        {
            context.Expenses.Add(expense);
        }
        else
        {
            context.Expenses.Update(expense);
        }

        await context.SaveChangesAsync();
        return expense;
    }

    [HttpDelete]
    public async Task<int> DeleteExpense(ExpenseDbContext context, Expense expense)
    {
        context.Expenses.Remove(expense);
        return await context.SaveChangesAsync();
    }

    [HttpGet("by-date-category/{startDate:datetime}/{endDate:datetime}/{categoryId:int}")]
    public async Task<List<Expense>> ByDateAndCategory(ExpenseDbContext context, DateTime startDate, DateTime endDate, int categoryId)
    {
        return await context.Expenses
            .Where(i => i.Date >= startDate.Date && i.Date <= endDate.Date && i.CategoryId == categoryId)
            .Include(i=> i.Category)
            .OrderByDescending(i=> i.Date)
            .ToListAsync();
    }
}