using mathew.entities;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace mathew.api.Controllers;

[ApiController]
[Route("[controller]")]
[EnableCors]
public class HomeTaskController : ControllerBase
{
    [HttpGet("{familyId:int}")]
    public async Task<List<HomeTask>> GetTasks(ExpenseDbContext context, int familyId, [FromQuery] string status = "all", [FromQuery] string? userName = null)
    {
        var query = context.Set<HomeTask>()
            .Where(t => t.FamilyId == familyId)
            .AsQueryable();

        if (!string.IsNullOrEmpty(userName))
        {
            query = query.Where(t => t.UserName == userName);
        }

        if (status.ToLower() == "done")
        {
            query = query.Where(t => t.Done);
        }
        else if (status.ToLower() == "pending")
        {
            query = query.Where(t => !t.Done);
        }

        return await query.OrderBy(t => t.DueDate).ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<HomeTask>> CreateTask(ExpenseDbContext context, HomeTask task)
    {
        if (task.FamilyId == 0)
            return BadRequest("FamilyId is required");

        if (string.IsNullOrEmpty(task.UserName))
            return BadRequest("UserName is required");

        context.Set<HomeTask>().Add(task);
        await context.SaveChangesAsync();

        return task;
    }

    [HttpPut]
    public async Task<ActionResult<HomeTask>> UpdateTask(ExpenseDbContext context, HomeTask task)
    {
        var existing = await context.Set<HomeTask>().FindAsync(task.Id);
        if (existing == null)
            return NotFound();

        existing.Description = task.Description;
        existing.Done = task.Done;
        existing.DueDate = task.DueDate;
        existing.Rating = task.Rating;
        existing.RatingComment = task.RatingComment;
        existing.UserName = task.UserName;

        await context.SaveChangesAsync();


        return existing;
    }

    [HttpDelete("{id:int}")]
    public async Task<ActionResult> DeleteTask(ExpenseDbContext context, int id)
    {
        var existing = await context.Set<HomeTask>().FindAsync(id);
        if (existing == null)
            return NotFound();

        context.Set<HomeTask>().Remove(existing);
        await context.SaveChangesAsync();
        return Ok();
    }
}
