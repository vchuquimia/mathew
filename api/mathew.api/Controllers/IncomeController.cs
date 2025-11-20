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
    public async Task<List<Income>> GetAll(ExpenseDbContext context, int year, int month, int familyId, string? userName = null)
    {
        return await context.Incomes
            .Where(i=> (i.UserName == userName || userName == null) 
                && i.Date.Year == year && i.Date.Month == month
                && i.FamilyId == familyId)
            .Include(i=>i.IncomeSource).ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<Income>> Save(ExpenseDbContext context, Income income)
    {
        income.IncomeSourceId = income.IncomeSource.Id;
        income.IncomeSource = null;

        // Validate FamilyId is set
        if (income.FamilyId == 0)
            return BadRequest("FamilyId is required");

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
    public async Task<ActionResult<int>> DeleteCategory(ExpenseDbContext context, Income income)
    {
        // Validate FamilyId is set
        if (income.FamilyId == 0)
            return BadRequest("FamilyId is required");


        context.Incomes.Remove(income);
        return await context.SaveChangesAsync();
    }

    [HttpGet("getincomebudgetsummary/{year:int}/{month:int}")]
    public async Task<List<FinantialSummaryDto>> ByDate(ExpenseDbContext context, int year, int month, int familyId, string? userName = null)
    {

        var result = await context.Database
            .SqlQueryRaw<FinantialSummaryDto>(@"
                    SELECT
                        u.Name AS UserName,
                        @year AS Year,
                        @month AS Month,
                        COALESCE(i.IncomeAmount, 0) AS IncomeAmount,
                        COALESCE(b.BudgetAmount, 0) AS BudgetAmount,
                        COALESCE(e.ExpenseAmount, 0) AS ExpenseAmount,
                       COALESCE(IncomeAmount, 0) - COALESCE(ExpenseAmount, 0) AS Balance
                    FROM Users u
                    LEFT JOIN (
                            SELECT UserName, sum(amount) AS IncomeAmount
                                from Incomes i
                            where  YEAR(i.Date) = @year AND MONTH(i.Date) = @month
                                AND i.FamilyId = @familyId
                            GROUP BY UserName
                                ) i ON i.UserName = u.Name
                    LEFT JOIN (
                            select UserName, sum(Amount) AS BudgetAmount
                            from Budgets b
                            WHERE b.Year = @year AND b.Month = @month
                                AND b.FamilyId = @familyId
                            GROUP BY UserName
                            ) b ON b.UserName = u.Name
                     LEFT JOIN (
                            select RegisteredBy, sum(Amount) AS ExpenseAmount
                            from Expenses e
                            where  YEAR(e.Date) = @year AND MONTH(e.Date) = @month
                                AND e.FamilyId = @familyId
                            GROUP BY RegisteredBy
                            ) e ON e.RegisteredBy = u.Name
                    WHERE u.FamilyId = @familyId
                        AND (u.Name = @userName OR @userName IS NULL)",
                new SqlParameter("@year", year),
                new SqlParameter("@month", month),
                new SqlParameter("@userName", (object)userName??DBNull.Value),
                new SqlParameter("@familyId", familyId))
            .ToListAsync();

        if (userName == null)
        {
            result.Add(new FinantialSummaryDto
            {
                Balance = result.Sum(i=>i.Balance),
                IncomeAmount = result.Sum(i=>i.IncomeAmount),
                BudgetAmount = result.Sum(i=>i.BudgetAmount),
                ExpenseAmount = result.Sum(i=>i.ExpenseAmount),
                Month = month,
                UserName = "General",
                Year = year,
            });
        }

        return result;
    }

    [HttpGet("getincomebudgetsummary-by-date-and-user/{year:int}/{month:int}")]
    public async Task<List<FinantialSummaryDto>> ByDateAndUser(ExpenseDbContext context, int year, int month, int familyId, string? userName = null)
    {

        var result = await context.Database
            .SqlQueryRaw<FinantialSummaryDto>(@"
         SELECT
            u.Name AS UserName,
            @year AS Year,
            @month AS Month,
            COALESCE(SUM(i.Amount), 0) AS IncomeAmount,
            COALESCE(SUM(b.Amount), 0) AS BudgetAmount,
            COALESCE(SUM(i.Amount), 0) - COALESCE(SUM(b.Amount), 0) AS Balance
        FROM Users u
                 LEFT JOIN Incomes i ON i.UserName = u.Name 
                    AND YEAR(i.Date) = @year AND MONTH(i.Date) = @month
                    AND i.FamilyId = @familyId
                 LEFT JOIN Budgets b ON b.UserName = u.Name 
                    AND b.Year = @year AND b.Month = @month
                    AND b.FamilyId = @familyId
        WHERE u.FamilyId = @familyId
            AND (u.Name = @userName OR @userName IS NULL)
        GROUP BY u.Name
        ",
                new SqlParameter("@year", year),
                new SqlParameter("@month", month),
                new SqlParameter("@userName", (object)userName??DBNull.Value),
                new SqlParameter("@familyId", familyId)).ToListAsync();

        return result;
    }


}