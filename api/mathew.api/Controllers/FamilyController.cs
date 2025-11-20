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
        context.Families.Add(family);
        await context.SaveChangesAsync();
        return family;
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<Family>> Update(ExpenseDbContext context, int id, Family family)
    {
        if (id != family.Id)
            return BadRequest();

        var existingFamily = await context.Families.FindAsync(id);
        if (existingFamily == null)
            return NotFound();

        existingFamily.Name = family.Name;
        existingFamily.Description = family.Description;

        await context.SaveChangesAsync();
        return existingFamily;
    }

    [HttpDelete("{id:int}")]
    public async Task<ActionResult<int>> Delete(ExpenseDbContext context, int id)
    {
        var family = await context.Families.FindAsync(id);
        if (family == null)
            return NotFound();

        // Check if family has users
        var hasUsers = await context.Users.AnyAsync(u => u.FamilyId == id);
        if (hasUsers)
            return BadRequest("Cannot delete family with existing users");

        context.Families.Remove(family);
        return await context.SaveChangesAsync();
    }
}

