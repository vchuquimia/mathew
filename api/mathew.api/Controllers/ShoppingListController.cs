using mathew.entities;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace mathew.api.Controllers;

[ApiController]
[Route("[controller]")]
[EnableCors]
public class ShoppingListController : ControllerBase
{
    [HttpGet("{familyId:int}")]
    public async Task<List<ShoppingList>> GetLists(ExpenseDbContext context, int familyId)
    {
        return await context.Set<ShoppingList>()
            .Where(l => l.FamilyId == familyId)
            .Include(l => l.Items)
            .ThenInclude(i => i.Category)
            .OrderByDescending(l => l.CreatedDate)
            .ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<ShoppingList>> CreateList(ExpenseDbContext context, ShoppingList list)
    {
        if (list.FamilyId == 0)
            return BadRequest("FamilyId is required");

        context.Set<ShoppingList>().Add(list);
        await context.SaveChangesAsync();
        return list;
    }

    [HttpPut]
    public async Task<ActionResult<ShoppingList>> UpdateList(ExpenseDbContext context, ShoppingList list)
    {
        var existing = await context.Set<ShoppingList>().FindAsync(list.Id);
        if (existing == null)
            return NotFound();

        existing.Name = list.Name;
        existing.Done = list.Done;
        // Update other fields if necessary

        await context.SaveChangesAsync();
        return existing;
    }

    [HttpGet("list/{id}")]
    public async Task<ActionResult<ShoppingList>> GetList(ExpenseDbContext context, int id)
    {
        var list = await context.Set<ShoppingList>()
            .Include(l => l.Items)
            .ThenInclude(i => i.Category)
            .FirstOrDefaultAsync(l => l.Id == id);

        if (list == null)
            return NotFound();

        return list;
    }

    [HttpPost("item")]
    public async Task<ActionResult<ShoppingListItem>> AddItem(ExpenseDbContext context, ShoppingListItem item)
    {
        item.Category = null;
        if (item.ShoppingListId == 0)
            return BadRequest("ShoppingListId is required");
        if (item.CategoryId == 0)
            return BadRequest("CategoryId is required");

        context.Set<ShoppingListItem>().Add(item);
        await context.SaveChangesAsync();

        // Reload to include category details if needed for response
        return item;
    }

    [HttpPut("item")]
    public async Task<ActionResult<ShoppingListItem>> UpdateItem(ExpenseDbContext context, ShoppingListItem item)
    {
        var existing = await context.Set<ShoppingListItem>().FindAsync(item.Id);
        if (existing == null)
            return NotFound();

        existing.Name = item.Name;
        existing.BudgetAmount = item.BudgetAmount;
        existing.CategoryId = item.CategoryId;
        existing.Done = item.Done;

        await context.SaveChangesAsync();
        return existing;
    }

    [HttpPost("purchase/{itemId:int}")]
    public async Task<ActionResult<Expense>> PurchaseItem(ExpenseDbContext context, int itemId, [FromQuery] decimal amount, [FromQuery] string registeredBy)
    {
        if (string.IsNullOrEmpty(registeredBy))
        {
            return BadRequest("RegisteredBy is required");
        }

        var item = await context.Set<ShoppingListItem>()
            .Include(i => i.ShoppingList)
            .FirstOrDefaultAsync(i => i.Id == itemId);

        if (item == null)
            return NotFound("Item not found");

        if (item.Done)
            return BadRequest("Item is already bought");

        // 1. Mark item as bought
        item.Done = true;

        // 2. Create the Expense
        var expense = new Expense
        {
            Description = item.Name,
            CategoryId = item.CategoryId,
            FamilyId = item.ShoppingList?.FamilyId ?? 0,
            Date = DateTimeOffset.UtcNow,
            Amount = amount,
            RegisteredBy = registeredBy
        };

        context.Expenses.Add(expense);
        await context.SaveChangesAsync();

        return expense;
    }
}
