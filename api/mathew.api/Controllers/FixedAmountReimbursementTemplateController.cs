using mathew.entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace mathew.api.Controllers;

[ApiController]
[Route("[controller]")]
public class FixedAmountReimbursementTemplateController : ControllerBase
{
    [HttpGet]
    public async Task<List<FixedAmountReimbursementTemplate>> Get(
        ExpenseDbContext context, int familyId, string? userName = null)
    {
        return await context.FixedAmountReimbursementTemplates
            .Where(t => t.FamilyId == familyId
                && (userName == null || t.UserName == userName))
            .ToListAsync();
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<FixedAmountReimbursementTemplate>> GetById(
        ExpenseDbContext context, int id, int familyId)
    {
        var template = await context.FixedAmountReimbursementTemplates
            .FirstOrDefaultAsync(t => t.Id == id && t.FamilyId == familyId);

        return template is null ? NotFound() : Ok(template);
    }

    [HttpPost]
    public async Task<ActionResult<FixedAmountReimbursementTemplate>> Save(
        ExpenseDbContext context, FixedAmountReimbursementTemplate template)
    {
        if (template.FamilyId == 0)
            return BadRequest("FamilyId is required");

        if (template.Id == 0)
            context.FixedAmountReimbursementTemplates.Add(template);
        else
            context.FixedAmountReimbursementTemplates.Update(template);

        await context.SaveChangesAsync();
        return template;
    }

    [HttpDelete("{id:int}")]
    public async Task<ActionResult<int>> Delete(
        ExpenseDbContext context, int id, int familyId)
    {
        var template = await context.FixedAmountReimbursementTemplates
            .FirstOrDefaultAsync(t => t.Id == id && t.FamilyId == familyId);

        if (template is null)
            return NotFound();

        context.FixedAmountReimbursementTemplates.Remove(template);
        return await context.SaveChangesAsync();
    }
}

