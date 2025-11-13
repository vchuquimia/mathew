using mathew.entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace mathew.api.Controllers;

[ApiController]
[Route("[controller]")]
public class IncomeController : ControllerBase
{
    [HttpGet("{year:int}/{month:int}")]
    public async Task<List<Income>> GetAll(ExpenseDbContext context, int year, int month, string? userName = null)
    {
        return await context.Incomes
            .Where(i=> (i.UserName == userName || userName == null) && i.Date.Year == year && i.Date.Month == month)
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
    public async Task<List<IncomeBudgetMontlySummaryDto>> ByDate(ExpenseDbContext context, int year, int month, string? userName)
    {
        //test
        var result = await context.Database
            .SqlQueryRaw<IncomeBudgetMontlySummaryDto>(@"
                    SELECT
                        u.Name AS UserName,
                        @year AS Year,
                        @month AS Month,
                        COALESCE(i.IncomeAmount, 0) AS IncomeAmount,
                        COALESCE(b.BudgetAmount, 0) AS BudgetAmount,
                       COALESCE(IncomeAmount, 0) - COALESCE(BudgetAmount, 0) AS Balance
                    FROM Users u
                    LEFT JOIN (
                            SELECT UserName, sum(amount) AS IncomeAmount
                                from Incomes i
                            where  YEAR(i.Date) = @year AND MONTH(i.Date) = @month
                            GROUP BY UserName
                                ) i ON i.UserName = u.Name
                    LEFT JOIN (
                        select UserName, sum(Amount) AS BudgetAmount
                        from Budgets b
                        WHERE b.Year = @year AND b.Month = @month
                        GROUP BY UserName
                        ) b ON b.UserName = u.Name
                    WHERE u.Name = @userName OR @userName IS NULL",
                new SqlParameter("@year", year),
                new SqlParameter("@month", month),
                new SqlParameter("@userName", (object)userName??DBNull.Value))
            .ToListAsync();

        return result;
    }

    [HttpGet("getincomebudgetsummary-by-date-and-user/{year:int}/{month:int}")]
    public async Task<List<IncomeBudgetMontlySummaryDto>> ByDateAndUser(ExpenseDbContext context, int year, int month, string? userName)
    {
        var result = await context.Database
            .SqlQueryRaw<IncomeBudgetMontlySummaryDto>(@"
         SELECT
            u.Name AS UserName,
            @year AS Year,
            @month AS Month,
            COALESCE(SUM(i.Amount), 0) AS IncomeAmount,
            COALESCE(SUM(b.Amount), 0) AS BudgetAmount,
            COALESCE(SUM(i.Amount), 0) - COALESCE(SUM(b.Amount), 0) AS Balance
        FROM Users u
                 LEFT JOIN Incomes i ON i.UserName = u.Name AND YEAR(i.Date) = @year AND MONTH(i.Date) = @month
                 LEFT JOIN Budgets b ON b.UserName = u.Name AND  b.Year = @year AND b.Month = @month
        WHERE u.Name = @userName OR @userName IS NULL
        GROUP BY u.Name
        ",
                new SqlParameter("@year", year),
                new SqlParameter("@month", month),
                new SqlParameter("@userName", (object)userName??DBNull.Value)).ToListAsync();

        return result;
    }


}