
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
    public DbSet<User> Users => Set<User>();

    public DbSet<Reimbursement> Reimbursements => Set<Reimbursement>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Category>()
            .HasIndex(c => c.Name)
            .IsUnique();

        modelBuilder.Entity<Budget>();

        modelBuilder.Entity<IncomeSource>()
            .HasIndex(s => s.Name)
            .IsUnique();

        modelBuilder.Entity<User>()
            .HasIndex(c => c.Name)
            .IsUnique();
    }
}