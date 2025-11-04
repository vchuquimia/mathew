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
        DateTime endDate)
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
        LEFT JOIN Budgets b ON c.Id = b.CategoryId AND b.Year = YEAR(@endDate) 
                                   AND b.Month = MONTH(@endDate)
        
        GROUP BY c.Id, c.Name
        ORDER BY TotalAmount DESC";

        var startParam = new SqlParameter("@startDate", startDate.Date);
        var endParam = new SqlParameter("@endDate", endDate.Date);

        var summary = await context.Database
            .SqlQueryRaw<ExpenseSummaryDto>(sql, startParam, endParam)
            .ToListAsync();

        return summary;
    }

    [HttpGet("SummaryByDateRangeAndCategory")]
    public async Task<ExpenseSummaryDto?> GetSummaryByDateRangeAndCategoryAsync(ExpenseDbContext context,
        DateTime startDate,
        DateTime endDate, int categoryId)
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
                (SELECT e.CategoryId, e.Amount, e.Date
                FROM Expenses e
                WHERE e.CategoryId = @categoryId) e
                 LEFT JOIN Budgets b ON e.CategoryId = b.CategoryId AND b.Year = YEAR(@endDate)
            AND CAST(e.Date AS DATE) >= @startDate
            AND CAST(e.Date AS DATE) <= @endDate
            AND e.CategoryId = @categoryId
            AND b.Month = MONTH(@endDate)
            GROUP BY e.categoryId
            ";

        var startParam = new SqlParameter("@startDate", startDate.Date);
        var endParam = new SqlParameter("@endDate", endDate.Date);
        var categoryIdParam = new SqlParameter("@categoryId", categoryId);

        var result = await context.Database
            .SqlQueryRaw<ExpenseSummaryDto>(sql, startParam, endParam, categoryIdParam)
            .FirstOrDefaultAsync();

        return result;
    }


}