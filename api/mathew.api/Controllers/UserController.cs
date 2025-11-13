using mathew.entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace mathew.api.Controllers;

[ApiController]
[Route("[controller]")]
public class UserController : ControllerBase
{
    [HttpGet("")]
    public async Task<List<User>> GetAll(ExpenseDbContext context)
    {
        return await context.Users.ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<User>> Save(ExpenseDbContext context, User user)
    {
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
    public async Task<int> DeleteCategory(ExpenseDbContext context, User user)
    {
        context.Users.Remove(user);
        return await context.SaveChangesAsync();
    }
}