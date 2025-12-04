using mathew.entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace mathew.api.Controllers;

[ApiController]
[Route("[controller]")]
public class ReimbursementController : ControllerBase
{
    [HttpGet("")]
    public async Task<List<Reimbursement>> Get(ExpenseDbContext context, bool? pending, int familyId, string? userName = null)
    {
        return await context.Reimbursements
            .Where(b => (b.UserName == userName || userName == null) 
                && (b.Pending == pending || pending == null)
                && b.FamilyId == familyId)
            .Include(i=> i.Expense)
            .Include(i=>i.Expense.Category)
            .OrderByDescending(i=> i.Expense.Date)
            .ToListAsync();
    }

    [HttpGet("getbyexpenseid/{expenseid:int}")]
    public async Task<Reimbursement?> GetByExpense(ExpenseDbContext context, int expenseid, int familyId)
    {
        return await context.Reimbursements
            .Where(b => b.ExpenseId == expenseid
                && b.FamilyId == familyId)
            .Include(i=> i.Expense)
            .Include(i=>i.Expense.Category)
            .FirstOrDefaultAsync();
    }

    [HttpPost]
    public async Task<ActionResult<Reimbursement>> Create(ExpenseDbContext context, Reimbursement reimbursement)
    {
        // Validate FamilyId is set
        if (reimbursement.FamilyId == 0)
            return BadRequest("FamilyId is required");

        reimbursement.ExpenseId = reimbursement.Expense.Id;
        
        // Get the expense to ensure it belongs to the same family
        var expense = await context.Expenses
            .FirstOrDefaultAsync(e => e.Id == reimbursement.Expense.Id);
        
        if (expense == null)
            return BadRequest("Expense not found");

        if (expense.FamilyId != reimbursement.FamilyId)
            return Forbid("Expense does not belong to your family");

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
    public async Task<ActionResult<int>> Delete(ExpenseDbContext context, Reimbursement reimbursement)
    {
        // Validate FamilyId is set
        if (reimbursement.FamilyId == 0)
            return BadRequest("FamilyId is required");


        context.Reimbursements.Remove(reimbursement);
        return await context.SaveChangesAsync();
    }

    [HttpPost("reimburse-expense")]
    public async Task<ActionResult> ReimburseExpense(ExpenseDbContext context, Reimbursement reimbursement)
    {

        // Get or create the 'reembolsos' income source
        var incomeSource = await context.IncomeSources
            .FirstOrDefaultAsync(s => s.Name == "Reembolsos" && s.FamilyId == reimbursement.FamilyId);

        if (incomeSource == null)
        {
            incomeSource = new IncomeSource
            {
                Name = "reembolsos",
                Description = "Todos los reembolsos recibidos.",
                FamilyId = reimbursement.FamilyId
            };
            context.IncomeSources.Add(incomeSource);
            await context.SaveChangesAsync();
        }




        reimbursement.Pending = false;
        reimbursement.ReimbursementDate = DateTime.UtcNow;



        // Create an income entry for the reimbursement
        var income = new Income
        {
            Amount = reimbursement.Amount,
            Date = DateTime.UtcNow,
            Description = $"[Reembolso] por: {reimbursement.Expense?.Description ?? "expense"}",
            UserName = reimbursement.UserName,
            FamilyId = reimbursement.FamilyId,
            IncomeSourceId = incomeSource.Id

        };
        context.Incomes.Add(income);

        context.Reimbursements.Update(reimbursement);
        var result = await context.SaveChangesAsync();
        return Ok(result);
    }


}