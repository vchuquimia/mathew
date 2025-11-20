using mathew.entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace mathew.api.Controllers;

[ApiController]
[Route("[controller]")]
public class FamilyController : ControllerBase
{
    [HttpGet("")]
    public async Task<List<Family>> GetAll(ExpenseDbContext context)
    {
        return await context.Families.ToListAsync();
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Family>> GetById(ExpenseDbContext context, int id)
    {
        var family = await context.Families.FindAsync(id);
        if (family == null)
            return NotFound();

        return family;
    }

    [HttpPost]
    public async Task<ActionResult<Family>> Create(ExpenseDbContext context, Family family)
    {
        if (family.Id == 0)
        {
            context.Families.Add(family);
        }
        else
        {
            context.Families.Update(family);
        }

        await context.SaveChangesAsync();
        return family;
    }


    [HttpDelete()]
    public async Task<ActionResult<int>> Delete(ExpenseDbContext context, Family family)
    {

        // Check if family has users
        var hasUsers = await context.Users.AnyAsync(u => u.FamilyId == family.Id);
        if (hasUsers)
            return BadRequest("Cannot delete family with existing users");

        context.Families.Remove(family);
        return await context.SaveChangesAsync();
    }
}
