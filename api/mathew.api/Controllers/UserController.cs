using mathew.entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace mathew.api.Controllers;

[ApiController]
[Route("[controller]")]
public class UserController : ControllerBase
{
    [HttpGet("")]
    public async Task<List<User>> GetAll(ExpenseDbContext context, int familyId)
    {
        return await context.Users
            .Where(u => u.FamilyId == familyId)
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
            // Verify the user belongs to the same family (or allow update if admin)
            var existingUser = await context.Users
                .FirstOrDefaultAsync(u => u.Id == user.Id);
            if (existingUser != null && existingUser.FamilyId != user.FamilyId)
                return Forbid("Cannot change user's family");
            
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

        var existingUser = await context.Users
            .FirstOrDefaultAsync(u => u.Id == user.Id && u.FamilyId == user.FamilyId);
        if (existingUser == null)
            return Forbid("User does not belong to your family");

        context.Users.Remove(user);
        return await context.SaveChangesAsync();
    }
}