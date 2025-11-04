using mathew.entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace mathew.api.Controllers;

[ApiController]
[Route("[controller]")]
public class IncomeController : ControllerBase
{
    [HttpGet("")]
    public async Task<List<Income>> GetAll(ExpenseDbContext context)
    {
        return await context.Incomes
            .Include(i=>i.IncomeSource).ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<Income>> Save(ExpenseDbContext context, Income income)
    {
        income.IncomeSourceId = income.IncomeSource.Id;
        income.IncomeSource = null;

        if (income.Id == 0)
        {
            context.Incomes.Add(income);
        }
        else
        {
            context.Incomes.Update(income);
        }

        await context.SaveChangesAsync();
        return income;
    }

    [HttpDelete]
    public async Task<int> DeleteCategory(ExpenseDbContext context, Income income)
    {
        context.Incomes.Remove(income);
        return await context.SaveChangesAsync();
    }

    [HttpGet("getincomebudgetsummary/{year:int}/{month:int}")]
    public async Task<IncomeBudgetMontlySummaryDto> ByDate(ExpenseDbContext context, int year, int month)
    {
        var result = await context.Database
            .SqlQueryRaw<IncomeBudgetMontlySummaryDto>(@"
                SELECT 
                    @year AS Year,
                    @month AS Month,
                    COALESCE(SUM(i.Amount), 0) AS IncomeAmount,
                    COALESCE(SUM(b.Amount), 0) AS BudgetAmount,
                    COALESCE(SUM(i.Amount), 0) - COALESCE(SUM(b.Amount), 0) AS Balance
                FROM (SELECT 1 AS Dummy) AS dummy
                LEFT JOIN Incomes i ON YEAR(i.Date) = @year AND MONTH(i.Date) = @month
                LEFT JOIN Budgets b ON b.Year = @year AND b.Month = @month",
                new SqlParameter("@year", year),
                new SqlParameter("@month", month))
            .FirstOrDefaultAsync();

        return result;
    }
}