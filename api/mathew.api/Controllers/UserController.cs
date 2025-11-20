using mathew.entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace mathew.api.Controllers;

[ApiController]
[Route("[controller]")]
public class UserController : ControllerBase
{
    [HttpGet("")]
    public async Task<List<User>> GetAll(ExpenseDbContext context, int? familyId)
    {
        return await context.Users
            .Where(u => u.FamilyId == familyId || familyId == null)
            .ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<User>> Save(ExpenseDbContext context, User user)
    {
        // Verify FamilyId is set
        if (user.FamilyId == 0)
            return BadRequest("FamilyId is required");

        // Verify family exists
        var familyExists = await context.Families
            .AnyAsync(f => f.Id == user.FamilyId);
        if (!familyExists)
            return BadRequest("Family not found");

        if (user.Id == 0)
        {
            context.Users.Add(user);
        }
        else
        {
            context.Users.Update(user);
        }

        await context.SaveChangesAsync();
        return user;
    }

    [HttpDelete]
    public async Task<ActionResult<int>> DeleteCategory(ExpenseDbContext context, User user)
    {
        // Validate FamilyId is set
        if (user.FamilyId == 0)
            return BadRequest("FamilyId is required");


        context.Users.Remove(user);
        return await context.SaveChangesAsync();
    }
}