using mathew.entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace mathew.api.Controllers;

[ApiController]
[Route("[controller]")]
public class ReportController : ControllerBase
{
    [HttpGet("")]
    public async Task<List<ExpenseSummaryDto>> GetExpenseSummaryByDateRangeAsync(ExpenseDbContext context,
        DateTime startDate,
        DateTime endDate,
        int familyId)
    {
        var sql = @"
        SELECT
            c.Id AS CategoryId,
            c.Name AS CategoryName,
            COALESCE(SUM(e.Amount), 0) AS TotalAmount,
            COUNT(e.Id) AS ExpenseCount,
            COALESCE(MAX(b.Amount), 0) AS BudgetAmount,
            COALESCE(MAX(b.Amount), 0) - COALESCE(SUM(e.Amount), 0) AS RemainingBudget,
            CASE
                WHEN MAX(b.Amount) > 0
                    THEN (COALESCE(SUM(e.Amount), 0) / MAX(b.Amount)) * 100
                ELSE 0
                END AS BudgetUsedPercentage
        FROM Categories c
                 LEFT JOIN Expenses e ON c.Id = e.CategoryId
            AND CAST(e.Date AS DATE) >= @startDate
            AND CAST(e.Date AS DATE) <= @endDate
            AND e.FamilyId = @familyId
                 LEFT JOIN ( select b.CategoryId , sum(b.Amount) Amount from  Budgets b
                                                 where b.Year = YEAR(@endDate)
                                                   AND b.Month = MONTH(@endDate)
                                                   AND b.FamilyId = @familyId group by b.CategoryId) b ON c.Id = b.CategoryId

        WHERE c.FamilyId = @familyId
        GROUP BY c.Id, c.Name
        ORDER BY TotalAmount DESC";

        var startParam = new SqlParameter("@startDate", startDate.Date);
        var endParam = new SqlParameter("@endDate", endDate.Date);
        var familyIdParam = new SqlParameter("@familyId", familyId);

        var summary = await context.Database
            .SqlQueryRaw<ExpenseSummaryDto>(sql, startParam, endParam, familyIdParam)
            .ToListAsync();

        return summary;
    }

    [HttpGet("SummaryByDateRangeAndCategory")]
    public async Task<ExpenseSummaryDto?> GetSummaryByDateRangeAndCategoryAsync(ExpenseDbContext context,
        DateTime startDate,
        DateTime endDate, 
        int categoryId,
        int familyId)
    {
        var sql = @"
               SELECT
            e.CategoryId ,
            COALESCE(SUM(e.Amount), 0) AS TotalAmount,
            COUNT(e.CategoryId) AS ExpenseCount,
            COALESCE(MAX(b.Amount), 0) AS BudgetAmount,
            COALESCE(MAX(b.Amount), 0) - COALESCE(SUM(e.Amount), 0) AS RemainingBudget,
            CASE
                WHEN MAX(b.Amount) > 0
                    THEN (COALESCE(SUM(e.Amount), 0) / MAX(b.Amount)) * 100
                ELSE 0
                END AS BudgetUsedPercentage
            FROM
                (SELECT e.CategoryId, e.Amount, e.Date, e.FamilyId
                FROM Expenses e
                WHERE e.CategoryId = @categoryId
                    AND e.FamilyId = @familyId) e
                 LEFT JOIN Budgets b ON e.CategoryId = b.CategoryId 
                    AND b.Year = YEAR(@endDate)
                    AND b.Month = MONTH(@endDate)
                    AND b.FamilyId = @familyId
            WHERE CAST(e.Date AS DATE) >= @startDate
                AND CAST(e.Date AS DATE) <= @endDate
                AND e.CategoryId = @categoryId
            GROUP BY e.categoryId
            ";

        var startParam = new SqlParameter("@startDate", startDate.Date);
        var endParam = new SqlParameter("@endDate", endDate.Date);
        var categoryIdParam = new SqlParameter("@categoryId", categoryId);
        var familyIdParam = new SqlParameter("@familyId", familyId);

        var result = await context.Database
            .SqlQueryRaw<ExpenseSummaryDto>(sql, startParam, endParam, categoryIdParam, familyIdParam)
            .FirstOrDefaultAsync();

        return result;
    }


}