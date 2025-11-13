using mathew.entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace mathew.api.Controllers;

[ApiController]
[Route("[controller]")]
public class ReimbursementController : ControllerBase
{
    [HttpGet("")]
    public async Task<List<Reimbursement>> Get(ExpenseDbContext context, bool? pending, string? userName)
    {
        return await context.Reimbursements
            .Where(b => (b.UserName == userName || userName == null) && (b.Pending == pending || pending == null))
            .Include(i=> i.Expense)
            .Include(i=>i.Expense.Category).ToListAsync();
    }

    [HttpGet("getbyexpenseid/{expenseid:int}")]
    public async Task<Reimbursement?> GetByExpense(ExpenseDbContext context, int expenseid)
    {
        return await context.Reimbursements
            .Where(b => b.ExpenseId == expenseid)
            .Include(i=> i.Expense)
            .Include(i=>i.Expense.Category)
            .FirstOrDefaultAsync();
    }

    [HttpPost]
    public async Task<ActionResult<Reimbursement>> Create(ExpenseDbContext context, Reimbursement reimbursement)
    {
        reimbursement.ExpenseId = reimbursement.Expense.Id;
        reimbursement.Expense = null;
        if (reimbursement.Id == 0)
        {
            context.Reimbursements.Add(reimbursement);
        }
        else
        {
            context.Reimbursements.Update(reimbursement);
        }

        await context.SaveChangesAsync();
        return reimbursement;
    }

    [HttpDelete]
    public async Task<int> DeleteBudget(ExpenseDbContext context, Reimbursement reimbursement)
    {
        context.Reimbursements.Remove(reimbursement);
        return await context.SaveChangesAsync();
    }



}