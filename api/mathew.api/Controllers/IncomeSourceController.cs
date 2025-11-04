using mathew.entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace mathew.api.Controllers;

[ApiController]
[Route("[controller]")]
public class IncomeSourceController : ControllerBase
{
    [HttpGet("")]
    public async Task<List<IncomeSource>> GetAll(ExpenseDbContext context)
    {
        return await context.IncomeSources.ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<IncomeSource>> Save(ExpenseDbContext context, IncomeSource incomeSource)
    {
        if (incomeSource.Id == 0)
        {
            context.IncomeSources.Add(incomeSource);
        }
        else
        {
            context.IncomeSources.Update(incomeSource);
        }

        await context.SaveChangesAsync();
        return incomeSource;
    }

    [HttpDelete]
    public async Task<int> DeleteCategory(ExpenseDbContext context, IncomeSource incomeSource)
    {
        context.IncomeSources.Remove(incomeSource);
        return await context.SaveChangesAsync();
    }
}