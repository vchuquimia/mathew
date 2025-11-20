using mathew.entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace mathew.api.Controllers;

[ApiController]
[Route("[controller]")]
public class CategoryController : ControllerBase
{
    [HttpGet("")]
    public async Task<List<Category>> SendCommand(ExpenseDbContext context, int familyId)
    {
        return await context.Categories
            .Where(c => c.FamilyId == familyId)
            .OrderBy(c => c.Name).ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<Category>> CreateCategory(ExpenseDbContext context, Category category)
    {
        // Set Family navigation property to null to avoid validation issues
        category.Family = null;
        
        // Validate FamilyId is set
        if (category.FamilyId == 0)
            return BadRequest("FamilyId is required");

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
    public async Task<ActionResult<int>> DeleteCategory(ExpenseDbContext context, Category category)
    {
        // Validate FamilyId is set
        if (category.FamilyId == 0)
            return BadRequest("FamilyId is required");

        context.Categories.Remove(category);
        return await context.SaveChangesAsync();
    }
}