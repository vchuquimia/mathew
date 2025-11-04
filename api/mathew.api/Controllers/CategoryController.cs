using mathew.entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace mathew.api.Controllers;

[ApiController]
[Route("[controller]")]
public class CategoryController : ControllerBase
{
    [HttpGet("")]
    public async Task<List<Category>> SendCommand(ExpenseDbContext context)
    {
        return await context.Categories.ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<Category>> CreateCategory(ExpenseDbContext context, Category category)
    {
        if (category.Id == 0)
        {
            context.Categories.Add(category);
        }
        else
        {
            context.Categories.Update(category);
        }

        await context.SaveChangesAsync();
        return category;
    }

    [HttpDelete]
    public async Task<int> DeleteCategory(ExpenseDbContext context, Category category)
    {
        context.Categories.Remove(category);
        return await context.SaveChangesAsync();
    }
}