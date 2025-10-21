using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json;
using System.Text.Json.Serialization;
using mathew.entities;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<ExpenseDbContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("MathewConnectionString")));
builder.Services.AddControllers();
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(builder =>
    {
        builder.AllowAnyOrigin() // Or specify origins
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});
// Configure JSON serialization for MCP compatibility
builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
    options.SerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
    options.SerializerOptions.Converters.Add(new JsonStringEnumConverter());
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<ExpenseDbContext>();
    dbContext.Database.EnsureCreated();
}


if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


app.UseHttpsRedirection();
app.MapControllers();
app.UseCors();
app.MapGet("/", () => "Hello World!");

// ============= MCP PROTOCOL ENDPOINTS =============
app.MapPost("/mcp/initialize", () => Results.Ok(new
{
    protocolVersion = "2024-11-05",
    serverInfo = new
    {
        name = "home-expenses-server",
        version = "1.0.0"
    },
    capabilities = new
    {
        tools = new { }
    }
}))
.WithName("MCPInitialize")
.WithOpenApi();

app.MapPost("/mcp/tools/list", () =>
{
    var tools = new object[]
    {
        new
        {
            name = "create_category",
            description = "Create a new expense category",
            inputSchema = new
            {
                type = "object",
                properties = new Dictionary<string, object>
                {
                    ["name"] = new { type = "string", description = "Category name" },
                    ["description"] = new { type = "string", description = "Category description (optional)" }
                },
                required = new[] { "name" }
            }
        },
        new
        {
            name = "list_categories",
            description = "List all expense categories",
            inputSchema = new
            {
                type = "object",
                properties = new Dictionary<string, object>()
            }
        },
        new
        {
            name = "create_expense",
            description = "Record a new expense",
            inputSchema = new
            {
                type = "object",
                properties = new Dictionary<string, object>
                {
                    ["amount"] = new { type = "number", description = "Expense amount" },
                    ["description"] = new { type = "string", description = "Expense description" },
                    ["date"] = new { type = "string", description = "Date in ISO format (YYYY-MM-DD)" },
                    ["categoryId"] = new { type = "integer", description = "Category ID" }
                },
                required = new[] { "amount", "description", "date", "categoryId" }
            }
        },
        new
        {
            name = "list_expenses",
            description = "List expenses with optional filters",
            inputSchema = new
            {
                type = "object",
                properties = new Dictionary<string, object>
                {
                    ["startDate"] = new { type = "string", description = "Start date filter (YYYY-MM-DD)" },
                    ["endDate"] = new { type = "string", description = "End date filter (YYYY-MM-DD)" },
                    ["categoryId"] = new { type = "integer", description = "Filter by category ID" }
                }
            }
        },
        new
        {
            name = "update_expense",
            description = "Update an existing expense",
            inputSchema = new
            {
                type = "object",
                properties = new Dictionary<string, object>
                {
                    ["id"] = new { type = "integer", description = "Expense ID" },
                    ["amount"] = new { type = "number", description = "Expense amount" },
                    ["description"] = new { type = "string", description = "Expense description" },
                    ["date"] = new { type = "string", description = "Date in ISO format (YYYY-MM-DD)" },
                    ["categoryId"] = new { type = "integer", description = "Category ID" }
                },
                required = new[] { "id", "amount", "description", "date", "categoryId" }
            }
        },
        new
        {
            name = "delete_expense",
            description = "Delete an expense by ID",
            inputSchema = new
            {
                type = "object",
                properties = new Dictionary<string, object>
                {
                    ["id"] = new { type = "integer", description = "Expense ID" }
                },
                required = new[] { "id" }
            }
        },
        new
        {
            name = "create_income_source",
            description = "Create a new income source",
            inputSchema = new
            {
                type = "object",
                properties = new Dictionary<string, object>
                {
                    ["name"] = new { type = "string", description = "Income source name" },
                    ["description"] = new { type = "string", description = "Source description (optional)" }
                },
                required = new[] { "name" }
            }
        },
        new
        {
            name = "list_income_sources",
            description = "List all income sources",
            inputSchema = new
            {
                type = "object",
                properties = new Dictionary<string, object>()
            }
        },
        new
        {
            name = "create_income",
            description = "Record a new income entry",
            inputSchema = new
            {
                type = "object",
                properties = new Dictionary<string, object>
                {
                    ["amount"] = new { type = "number", description = "Income amount" },
                    ["description"] = new { type = "string", description = "Income description" },
                    ["date"] = new { type = "string", description = "Date in ISO format (YYYY-MM-DD)" },
                    ["sourceId"] = new { type = "integer", description = "Income source ID" }
                },
                required = new[] { "amount", "description", "date", "sourceId" }
            }
        },
        new
        {
            name = "list_incomes",
            description = "List income entries with optional filters",
            inputSchema = new
            {
                type = "object",
                properties = new Dictionary<string, object>
                {
                    ["startDate"] = new { type = "string", description = "Start date filter (YYYY-MM-DD)" },
                    ["endDate"] = new { type = "string", description = "End date filter (YYYY-MM-DD)" },
                    ["sourceId"] = new { type = "integer", description = "Filter by source ID" }
                }
            }
        },
        new
        {
            name = "delete_income",
            description = "Delete an income entry by ID",
            inputSchema = new
            {
                type = "object",
                properties = new Dictionary<string, object>
                {
                    ["id"] = new { type = "integer", description = "Income ID" }
                },
                required = new[] { "id" }
            }
        },
        new
        {
            name = "create_budget",
            description = "Create a monthly budget for a category",
            inputSchema = new
            {
                type = "object",
                properties = new Dictionary<string, object>
                {
                    ["categoryId"] = new { type = "integer", description = "Category ID" },
                    ["amount"] = new { type = "number", description = "Budget amount" },
                    ["month"] = new { type = "integer", description = "Month (1-12)" },
                    ["year"] = new { type = "integer", description = "Year" }
                },
                required = new[] { "categoryId", "amount", "month", "year" }
            }
        },
        new
        {
            name = "list_budgets",
            description = "List all budgets",
            inputSchema = new
            {
                type = "object",
                properties = new Dictionary<string, object>()
            }
        },
        new
        {
            name = "update_budget",
            description = "Update an existing budget",
            inputSchema = new
            {
                type = "object",
                properties = new Dictionary<string, object>
                {
                    ["id"] = new { type = "integer", description = "Budget ID" },
                    ["categoryId"] = new { type = "integer", description = "Category ID" },
                    ["amount"] = new { type = "number", description = "Budget amount" },
                    ["month"] = new { type = "integer", description = "Month (1-12)" },
                    ["year"] = new { type = "integer", description = "Year" }
                },
                required = new[] { "id", "categoryId", "amount", "month", "year" }
            }
        },
        new
        {
            name = "delete_budget",
            description = "Delete a budget by ID",
            inputSchema = new
            {
                type = "object",
                properties = new Dictionary<string, object>
                {
                    ["id"] = new { type = "integer", description = "Budget ID" }
                },
                required = new[] { "id" }
            }
        },
        new
        {
            name = "get_budget_analysis",
            description = "Get budget analysis for a specific month showing spent vs budgeted amounts",
            inputSchema = new
            {
                type = "object",
                properties = new Dictionary<string, object>
                {
                    ["year"] = new { type = "integer", description = "Year" },
                    ["month"] = new { type = "integer", description = "Month (1-12)" }
                },
                required = new[] { "year", "month" }
            }
        },
        new
        {
            name = "get_expense_summary",
            description = "Get expense and income summary for a date range",
            inputSchema = new
            {
                type = "object",
                properties = new Dictionary<string, object>
                {
                    ["startDate"] = new { type = "string", description = "Start date (YYYY-MM-DD)" },
                    ["endDate"] = new { type = "string", description = "End date (YYYY-MM-DD)" }
                },
                required = new[] { "startDate", "endDate" }
            }
        },
        new
        {
            name = "get_cash_flow",
            description = "Get monthly cash flow analysis showing income, expenses, and savings rate",
            inputSchema = new
            {
                type = "object",
                properties = new Dictionary<string, object>
                {
                    ["year"] = new { type = "integer", description = "Year" },
                    ["month"] = new { type = "integer", description = "Month (1-12)" }
                },
                required = new[] { "year", "month" }
            }
        }
    };
    
    return Results.Ok(new { tools });
})
.WithName("MCPListTools")
.WithOpenApi();

app.MapPost("/mcp/tools/call", async (ExpenseDbContext db, McpToolCallRequest request) =>
{
    try
    {
        object result = request.Name switch
        {
            "create_category" => await CreateCategory(db, 
                JsonSerializer.Deserialize<CategoryDto>(request.Arguments.GetRawText())!),
            "list_categories" => await ListCategories(db),
            "create_expense" => await CreateExpense(db, 
                JsonSerializer.Deserialize<ExpenseDto>(request.Arguments.GetRawText())!),
            "list_expenses" => await ListExpenses(db, 
                JsonSerializer.Deserialize<ListExpensesRequest>(request.Arguments.GetRawText()) ?? new()),
            "update_expense" => await UpdateExpense(db, 
                JsonSerializer.Deserialize<UpdateExpenseDto>(request.Arguments.GetRawText())!),
            "delete_expense" => await DeleteExpense(db, 
                JsonSerializer.Deserialize<DeleteRequest>(request.Arguments.GetRawText())!),
            "create_income_source" => await CreateIncomeSource(db, 
                JsonSerializer.Deserialize<IncomeSourceDto>(request.Arguments.GetRawText())!),
            "list_income_sources" => await ListIncomeSources(db),
            "create_income" => await CreateIncome(db, 
                JsonSerializer.Deserialize<IncomeDto>(request.Arguments.GetRawText())!),
            "list_incomes" => await ListIncomes(db, 
                JsonSerializer.Deserialize<ListIncomesRequest>(request.Arguments.GetRawText()) ?? new()),
            "delete_income" => await DeleteIncome(db, 
                JsonSerializer.Deserialize<DeleteRequest>(request.Arguments.GetRawText())!),
            "create_budget" => await CreateBudget(db, 
                JsonSerializer.Deserialize<BudgetDto>(request.Arguments.GetRawText())!),
            "list_budgets" => await ListBudgets(db),
            "update_budget" => await UpdateBudget(db,JsonSerializer.Deserialize<UpdateBudgetRequest>(request.Arguments.GetRawText())!),

            "delete_budget" => await DeleteBudget(db,
                JsonSerializer.Deserialize<DeleteRequest>(request.Arguments.GetRawText())!),
            "get_budget_analysis" => await GetBudgetAnalysis(db,
                JsonSerializer.Deserialize<BudgetAnalysisRequest>(request.Arguments.GetRawText())!),
            "get_expense_summary" => await GetExpenseSummary(db,
                JsonSerializer.Deserialize<ExpenseSummaryRequest>(request.Arguments.GetRawText())!),
            "get_cash_flow" => await GetCashFlow(db,
                JsonSerializer.Deserialize<YearMonthRequest>(request.Arguments.GetRawText())!),
            _ => throw new Exception($"Unknown tool: {request.Name}")
        };
        
        return Results.Ok(new
        {
            content = new[]
            {
                new
                {
                    type = "text",
                    text = JsonSerializer.Serialize(result, new JsonSerializerOptions
                    {
                        WriteIndented = true,
                        PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                    })
                }
            }
        });
    }
    catch (Exception ex)
    {
        return Results.Ok(new
        {
            content = new[]
            {
                new
                {
                    type = "text",
                    text = $"Error: {ex.Message}"
                }
            },
            isError = true
        });
    }
})
.WithName("MCPCallTool")
.WithOpenApi();

app.Run();

// ============= MCP TOOL IMPLEMENTATIONS =============
static async Task<object> CreateCategory(ExpenseDbContext db, CategoryDto dto)
{
    var category = new Category { Name = dto.Name, Description = dto.Description };
    db.Categories.Add(category);
    await db.SaveChangesAsync();
    
    return new { success = true, category = new { category.Id, category.Name, category.Description } };
}

static async Task<object> ListCategories(ExpenseDbContext db)
{
    var categories = await db.Categories.ToListAsync();
    return new { categories = categories.Select(c => new { c.Id, c.Name, c.Description }) };
}

static async Task<object> CreateExpense(ExpenseDbContext db, ExpenseDto dto)
{
    var expense = new Expense
    {
        Amount = dto.Amount,
        Description = dto.Description,
        Date = dto.Date,
        CategoryId = dto.CategoryId
    };
    
    db.Expenses.Add(expense);
    await db.SaveChangesAsync();
    
    var created = await db.Expenses.Include(e => e.Category).FirstAsync(e => e.Id == expense.Id);
    return new 
    { 
        success = true, 
        expense = new 
        { 
            created.Id, 
            created.Amount, 
            created.Description, 
            created.Date, 
            created.CategoryId,
            categoryName = created.Category.Name
        } 
    };
}

static async Task<object> ListExpenses(ExpenseDbContext db, ListExpensesRequest request)
{
    var query = db.Expenses.Include(e => e.Category).AsQueryable();
    
    if (request.StartDate.HasValue)
        query = query.Where(e => e.Date >= request.StartDate.Value);
    
    if (request.EndDate.HasValue)
        query = query.Where(e => e.Date <= request.EndDate.Value);
    
    if (request.CategoryId.HasValue)
        query = query.Where(e => e.CategoryId == request.CategoryId.Value);
    
    var expenses = await query.OrderByDescending(e => e.Date).ToListAsync();
    return new 
    { 
        expenses = expenses.Select(e => new 
        { 
            e.Id, 
            e.Amount, 
            e.Description, 
            e.Date, 
            e.CategoryId, 
            categoryName = e.Category.Name 
        }), 
        count = expenses.Count 
    };
}

static async Task<object> UpdateExpense(ExpenseDbContext db, UpdateExpenseDto dto)
{
    var expense = await db.Expenses.FindAsync(dto.Id);
    
    if (expense == null)
        throw new Exception($"Expense with ID {dto.Id} not found");
    
    expense.Amount = dto.Amount;
    expense.Description = dto.Description;
    expense.Date = dto.Date;
    expense.CategoryId = dto.CategoryId;
    
    await db.SaveChangesAsync();
    
    var updated = await db.Expenses.Include(e => e.Category).FirstAsync(e => e.Id == dto.Id);
    return new 
    { 
        success = true, 
        expense = new 
        { 
            updated.Id, 
            updated.Amount, 
            updated.Description, 
            updated.Date, 
            updated.CategoryId,
            categoryName = updated.Category.Name
        } 
    };
}

static async Task<object> DeleteExpense(ExpenseDbContext db, DeleteRequest request)
{
    var expense = await db.Expenses.FindAsync(request.Id);
    
    if (expense == null)
        throw new Exception($"Expense with ID {request.Id} not found");
    
    db.Expenses.Remove(expense);
    await db.SaveChangesAsync();
    
    return new { success = true, message = $"Expense {request.Id} deleted successfully" };
}

static async Task<object> CreateIncomeSource(ExpenseDbContext db, IncomeSourceDto dto)
{
    var source = new IncomeSource { Name = dto.Name, Description = dto.Description };
    db.IncomeSources.Add(source);
    await db.SaveChangesAsync();
    
    return new { success = true, incomeSource = new { source.Id, source.Name, source.Description } };
}

static async Task<object> ListIncomeSources(ExpenseDbContext db)
{
    var sources = await db.IncomeSources.ToListAsync();
    return new { incomeSources = sources.Select(s => new { s.Id, s.Name, s.Description }) };
}

static async Task<object> CreateIncome(ExpenseDbContext db, IncomeDto dto)
{
    var income = new Income
    {
        Amount = dto.Amount,
        Description = dto.Description,
        Date = dto.Date,
        SourceId = dto.SourceId
    };
    
    db.Incomes.Add(income);
    await db.SaveChangesAsync();
    
    var created = await db.Incomes.Include(i => i.Source).FirstAsync(i => i.Id == income.Id);
    return new 
    { 
        success = true, 
        income = new 
        { 
            created.Id, 
            created.Amount, 
            created.Description, 
            created.Date, 
            created.SourceId,
            sourceName = created.Source.Name
        } 
    };
}

static async Task<object> ListIncomes(ExpenseDbContext db, ListIncomesRequest request)
{
    var query = db.Incomes.Include(i => i.Source).AsQueryable();
    
    if (request.StartDate.HasValue)
        query = query.Where(i => i.Date >= request.StartDate.Value);
    
    if (request.EndDate.HasValue)
        query = query.Where(i => i.Date <= request.EndDate.Value);
    
    if (request.SourceId.HasValue)
        query = query.Where(i => i.SourceId == request.SourceId.Value);
    
    var incomes = await query.OrderByDescending(i => i.Date).ToListAsync();
    return new 
    { 
        incomes = incomes.Select(i => new 
        { 
            i.Id, 
            i.Amount, 
            i.Description, 
            i.Date, 
            i.SourceId, 
            sourceName = i.Source.Name 
        }), 
        count = incomes.Count 
    };
}

static async Task<object> DeleteIncome(ExpenseDbContext db, DeleteRequest request)
{
    var income = await db.Incomes.FindAsync(request.Id);
    
    if (income == null)
        throw new Exception($"Income with ID {request.Id} not found");
    
    db.Incomes.Remove(income);
    await db.SaveChangesAsync();
    
    return new { success = true, message = $"Income {request.Id} deleted successfully" };
}


static async Task<object> CreateBudget(ExpenseDbContext db, BudgetDto dto)
{
    if (dto.Month < 1 || dto.Month > 12)
        throw new Exception("Month must be between 1 and 12");

    var budget = new Budget
    {
        CategoryId = dto.CategoryId,
        Amount = dto.Amount,
        Month = dto.Month,
        Year = dto.Year
    };
    
    db.Budgets.Add(budget);
    await db.SaveChangesAsync();
    
    var created = await db.Budgets.Include(b => b.Category).FirstAsync(b => b.Id == budget.Id);
    return new 
    { 
        success = true, 
        budget = new 
        { 
            created.Id, 
            created.CategoryId, 
            categoryName = created.Category.Name,
            created.Amount, 
            created.Month, 
            created.Year 
        } 
    };
}

static async Task<object> ListBudgets(ExpenseDbContext db)
{
    var budgets = await db.Budgets.Include(b => b.Category).ToListAsync();
    return new 
    { 
        budgets = budgets.Select(b => new 
        { 
            b.Id, 
            b.CategoryId, 
            categoryName = b.Category.Name,
            b.Amount, 
            b.Month, 
            b.Year 
        }) 
    };
}

static async Task<object> DeleteBudget(ExpenseDbContext db, DeleteRequest request)
{
    var budget = await db.Budgets.FindAsync(request.Id);
    
    if (budget == null)
        throw new Exception($"Budget with ID {request.Id} not found");
    
    db.Budgets.Remove(budget);
    await db.SaveChangesAsync();
    
    return new { success = true, message = $"Budget {request.Id} deleted successfully" };
}

static async Task<object> GetBudgetAnalysis(ExpenseDbContext db, BudgetAnalysisRequest request)
{
    if (request.Month < 1 || request.Month > 12)
        throw new Exception("Month must be between 1 and 12");
    
    var budgets = await db.Budgets
        .Include(b => b.Category)
        .Where(b => b.Year == request.Year && b.Month == request.Month)
        .ToListAsync();
    
    if (!budgets.Any())
        return new { year = request.Year, month = request.Month, analysis = Array.Empty<object>(), message = "No budgets found for this period" };
    
    var startDate = new DateTime(request.Year, request.Month, 1);
    var endDate = startDate.AddMonths(1).AddDays(-1);
    
    var analysis = new List<object>();
    
    foreach (var budget in budgets)
    {
        var totalSpent = await db.Expenses
            .Where(e => e.CategoryId == budget.CategoryId && e.Date >= startDate && e.Date <= endDate)
            .SumAsync(e => (decimal?)e.Amount) ?? 0;
        
        analysis.Add(new
        {
            budgetId = budget.Id,
            categoryId = budget.CategoryId,
            categoryName = budget.Category.Name,
            budgetAmount = budget.Amount,
            spentAmount = totalSpent,
            remaining = budget.Amount - totalSpent,
            percentageUsed = budget.Amount > 0 ? Math.Round((totalSpent / budget.Amount) * 100, 2) : 0,
            isOverBudget = totalSpent > budget.Amount
        });
    }
    
    var totalBudgeted = budgets.Sum(b => b.Amount);
    var totalSpentAll = analysis.Cast<dynamic>().Sum(a => (decimal)a.spentAmount);
    
    return new 
    { 
        year = request.Year, 
        month = request.Month, 
        analysis,
        summary = new
        {
            totalBudgeted,
            totalSpent = totalSpentAll,
            totalRemaining = totalBudgeted - totalSpentAll,
            overallPercentageUsed = totalBudgeted > 0 ? Math.Round((totalSpentAll / totalBudgeted) * 100, 2) : 0
        }
    };
}

static async Task<object> UpdateBudget(ExpenseDbContext db, UpdateBudgetRequest request)
{
    var budget = await db.Budgets.FindAsync(request.Id);
    
    if (budget == null)
        throw new Exception($"Budget with ID {request.Id} not found");
    
    if (request.Month < 1 || request.Month > 12)
        throw new Exception("Month must be between 1 and 12");
    
    budget.CategoryId = request.CategoryId;
    budget.Amount = request.Amount;
    budget.Month = request.Month;
    budget.Year = request.Year;
    
    await db.SaveChangesAsync();
    
    var updated = await db.Budgets.Include(b => b.Category).FirstAsync(b => b.Id == request.Id);
    return new 
    { 
        success = true, 
        budget = new 
        { 
            updated.Id, 
            updated.CategoryId, 
            categoryName = updated.Category.Name,
            updated.Amount, 
            updated.Month, 
            updated.Year 
        } 
    };
}

static async Task<object> GetExpenseSummary(ExpenseDbContext db, ExpenseSummaryRequest request)
{
    if (request.EndDate < request.StartDate)
        throw new Exception("End date must be after start date");
    
    var expenses = await db.Expenses
        .Include(e => e.Category)
        .Where(e => e.Date >= request.StartDate && e.Date <= request.EndDate)
        .ToListAsync();
    
    var incomes = await db.Incomes
        .Include(i => i.Source)
        .Where(i => i.Date >= request.StartDate && i.Date <= request.EndDate)
        .ToListAsync();
    
    var totalIncome = incomes.Sum(i => i.Amount);
    var totalExpenses = expenses.Sum(e => e.Amount);
    
    return new
    {
        startDate = request.StartDate,
        endDate = request.EndDate,
        totalIncome,
        totalExpenses,
        netIncome = totalIncome - totalExpenses,
        expenseCount = expenses.Count,
        incomeCount = incomes.Count,
        expensesByCategory = expenses.GroupBy(e => e.Category.Name)
            .Select(g => new 
            { 
                category = g.Key, 
                total = g.Sum(e => e.Amount), 
                count = g.Count(),
                percentage = totalExpenses > 0 ? Math.Round((g.Sum(e => e.Amount) / totalExpenses) * 100, 2) : 0
            })
            .OrderByDescending(x => x.total),
        incomesBySource = incomes.GroupBy(i => i.Source.Name)
            .Select(g => new 
            { 
                source = g.Key, 
                total = g.Sum(i => i.Amount), 
                count = g.Count(),
                percentage = totalIncome > 0 ? Math.Round((g.Sum(i => i.Amount) / totalIncome) * 100, 2) : 0
            })
            .OrderByDescending(x => x.total)
    };
}

static async Task<object> GetCashFlow(ExpenseDbContext db, YearMonthRequest request)
{
    if (request.Month < 1 || request.Month > 12)
        throw new Exception("Month must be between 1 and 12");
    
    var startDate = new DateTime(request.Year, request.Month, 1);
    var endDate = startDate.AddMonths(1).AddDays(-1);
    
    var expenses = await db.Expenses
        .Where(e => e.Date >= startDate && e.Date <= endDate)
        .SumAsync(e => (decimal?)e.Amount) ?? 0;
    
    var incomes = await db.Incomes
        .Where(i => i.Date >= startDate && i.Date <= endDate)
        .SumAsync(i => (decimal?)i.Amount) ?? 0;
    
    var budgetTotal = await db.Budgets
        .Where(b => b.Year == request.Year && b.Month == request.Month)
        .SumAsync(b => (decimal?)b.Amount) ?? 0;
    
    var netCashFlow = incomes - expenses;
    var savingsRate = incomes > 0 ? Math.Round((netCashFlow / incomes) * 100, 2) : 0;
    
    return new
    {
        year = request.Year,
        month = request.Month,
        monthName = new DateTime(request.Year, request.Month, 1).ToString("MMMM"),
        totalIncome = incomes,
        totalExpenses = expenses,
        budgetedExpenses = budgetTotal,
        netCashFlow,
        savingsRate,
        budgetVariance = budgetTotal > 0 ? expenses - budgetTotal : (decimal?)null,
        isOverBudget = budgetTotal > 0 && expenses > budgetTotal,
        status = netCashFlow > 0 ? "surplus" : netCashFlow < 0 ? "deficit" : "balanced"
    };
}

// ============= DB CONTEXT =============


// ============= DTOs =============
public record CategoryDto(string Name, string? Description);

public record ExpenseDto(
    decimal Amount,
    string Description,
    DateTime Date,
    int CategoryId
);

public record IncomeSourceDto(string Name, string? Description);

public record IncomeDto(
    decimal Amount,
    string Description,
    DateTime Date,
    int SourceId
);

public record BudgetDto(
    int CategoryId,
    decimal Amount,
    int Month,
    int Year
);

// ============= MCP REQUEST MODELS =============
public record McpToolCallRequest(string Name, JsonElement Arguments);

public record DeleteRequest(int Id);

public record UpdateExpenseDto(
    int Id,
    decimal Amount,
    string Description,
    DateTime Date,
    int CategoryId
);

public record UpdateBudgetDto(
    int Id,
    int CategoryId,
    decimal Amount,
    int Month,
    int Year
);

public record ListExpensesRequest(
    DateTime? StartDate = null,
    DateTime? EndDate = null,
    int? CategoryId = null
);

public record ListIncomesRequest(
    DateTime? StartDate = null,
    DateTime? EndDate = null,
    int? SourceId = null
);

public record BudgetAnalysisRequest(int Year, int Month);

public record ExpenseSummaryRequest(DateTime StartDate, DateTime EndDate);

public record YearMonthRequest(int Year, int Month);

public record UpdateBudgetRequest()
{
    public int Id { get; set; }
    public int Month { get; set; }
    public int CategoryId { get; set; }
    public decimal Amount { get; set; }
    public int Year { get; set; }
}