using mathew.entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace mathew.api.Controllers;

[ApiController]
[Route("[controller]")]
public class BudgetController : ControllerBase
{
    [HttpGet("{year:int}/{period:int}")]
    public async Task<List<Budget>> Get(ExpenseDbContext context, int year, int period)
    {
        return await context.Budgets
            .Where(b => b.Year == year && b.Month == period)
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
    public async Task<int> DeleteC(ExpenseDbContext context, Budget budget)
    {
        context.Budgets.Remove(budget);
        return await context.SaveChangesAsync();
    }
}