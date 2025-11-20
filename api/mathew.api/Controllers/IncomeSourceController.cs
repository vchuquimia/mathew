using mathew.entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace mathew.api.Controllers;

[ApiController]
[Route("[controller]")]
public class IncomeSourceController : ControllerBase
{
    [HttpGet("")]
    public async Task<List<IncomeSource>> GetAll(ExpenseDbContext context, int familyId)
    {
        return await context.IncomeSources
            .Where(i => i.FamilyId == familyId)
            .ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<IncomeSource>> Save(ExpenseDbContext context, IncomeSource incomeSource)
    {
        // Validate FamilyId is set
        if (incomeSource.FamilyId == 0)
            return BadRequest("FamilyId is required");

        if (incomeSource.Id == 0)
        {
            context.IncomeSources.Add(incomeSource);
        }
        else
        {
            // Verify the income source belongs to the specified family
            var existingIncomeSource = await context.IncomeSources
                .FirstOrDefaultAsync(i => i.Id == incomeSource.Id && i.FamilyId == incomeSource.FamilyId);
            if (existingIncomeSource == null)
                return Forbid("Income source does not belong to your family");
            
            context.IncomeSources.Update(incomeSource);
        }

        await context.SaveChangesAsync();
        return incomeSource;
    }

    [HttpDelete]
    public async Task<ActionResult<int>> DeleteCategory(ExpenseDbContext context, IncomeSource incomeSource)
    {
        // Validate FamilyId is set
        if (incomeSource.FamilyId == 0)
            return BadRequest("FamilyId is required");


        context.IncomeSources.Remove(incomeSource);
        return await context.SaveChangesAsync();
    }
}