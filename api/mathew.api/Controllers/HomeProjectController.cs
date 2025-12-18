using mathew.entities;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace mathew.api.Controllers;

[ApiController]
[Route("[controller]")]
[EnableCors]
public class HomeProjectController : ControllerBase
{
    [HttpGet("{familyId:int}")]
    public async Task<List<HomeProject>> GetProjects(ExpenseDbContext context, int familyId)
    {
        return await context.Set<HomeProject>()
            .Where(p => p.FamilyId == familyId)
            .Include(p => p.Logs)
            .Include(p => p.Tasks)
            .OrderByDescending(p => p.CreationDate)
            .ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<HomeProject>> CreateProject(ExpenseDbContext context, HomeProject project)
    {
        if (project.FamilyId == 0)
            return BadRequest("FamilyId is required");

        context.Set<HomeProject>().Add(project);
        await context.SaveChangesAsync();
        return project;
    }

    [HttpPut]
    public async Task<ActionResult<HomeProject>> UpdateProject(ExpenseDbContext context, HomeProject project)
    {
        var existing = await context.Set<HomeProject>().FindAsync(project.Id);
        if (existing == null)
            return NotFound();

        existing.Name = project.Name;
        existing.Status = project.Status;
        existing.Description = project.Description;
        existing.Feedback = project.Feedback;
        existing.FeedbackComment = project.FeedbackComment;

        await context.SaveChangesAsync();
        return existing;
    }

    [HttpDelete("{id:int}")]
    public async Task<ActionResult> DeleteProject(ExpenseDbContext context, int id)
    {
        var existing = await context.Set<HomeProject>().FindAsync(id);
        if (existing == null)
            return NotFound();

        context.Set<HomeProject>().Remove(existing);
        await context.SaveChangesAsync();
        return Ok();
    }

    [HttpPost("log")]
    public async Task<ActionResult<HomeProjectLog>> AddLog(ExpenseDbContext context, HomeProjectLog log)
    {
        context.Set<HomeProjectLog>().Add(log);
        await context.SaveChangesAsync();
        return log;
    }

    [HttpPost("task")]
    public async Task<ActionResult<HomeProjectTask>> AddTask(ExpenseDbContext context, HomeProjectTask task)
    {
        context.Set<HomeProjectTask>().Add(task);
        await context.SaveChangesAsync();
        return task;
    }

    [HttpPut("task")]
    public async Task<ActionResult<HomeProjectTask>> UpdateTask(ExpenseDbContext context, HomeProjectTask task)
    {
        var existing = await context.Set<HomeProjectTask>().FindAsync(task.Id);
        if (existing == null)
            return NotFound();

        existing.Description = task.Description;
        existing.Done = task.Done;

        await context.SaveChangesAsync();
        return existing;
    }

    [HttpDelete("task/{id:int}")]
    public async Task<ActionResult> DeleteTask(ExpenseDbContext context, int id)
    {
        var existing = await context.Set<HomeProjectTask>().FindAsync(id);
        if (existing == null)
            return NotFound();

        context.Set<HomeProjectTask>().Remove(existing);
        await context.SaveChangesAsync();
        return Ok();
    }
}

