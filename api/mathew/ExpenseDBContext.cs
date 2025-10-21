
using mathew.entities;
using Microsoft.EntityFrameworkCore;

public class ExpenseDbContext : DbContext
{
    public ExpenseDbContext(DbContextOptions<ExpenseDbContext> options) : base(options) { }

    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Expense> Expenses => Set<Expense>();
    public DbSet<Budget> Budgets => Set<Budget>();
    public DbSet<IncomeSource> IncomeSources => Set<IncomeSource>();
    public DbSet<Income> Incomes => Set<Income>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Category>()
            .HasIndex(c => c.Name)
            .IsUnique();

        modelBuilder.Entity<Budget>()
            .HasIndex(b => new { b.CategoryId, b.Month, b.Year })
            .IsUnique();

        modelBuilder.Entity<IncomeSource>()
            .HasIndex(s => s.Name)
            .IsUnique();
    }
}