using mathew.entities;
using Microsoft.EntityFrameworkCore;

public class ExpenseDbContext : DbContext
{
    public ExpenseDbContext(DbContextOptions<ExpenseDbContext> options) : base(options) { }

    public DbSet<Family> Families => Set<Family>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Expense> Expenses => Set<Expense>();
    public DbSet<Budget> Budgets => Set<Budget>();
    public DbSet<IncomeSource> IncomeSources => Set<IncomeSource>();
    public DbSet<Income> Incomes => Set<Income>();
    public DbSet<User> Users => Set<User>();

    public DbSet<Reimbursement> Reimbursements => Set<Reimbursement>();
    public DbSet<ShoppingList> ShoppingLists => Set<ShoppingList>();
    public DbSet<ShoppingListItem> ShoppingListItems => Set<ShoppingListItem>();

    public DbSet<HomeProject> HomeProjects => Set<HomeProject>();
    public DbSet<HomeProjectLog> HomeProjectLogs => Set<HomeProjectLog>();
    public DbSet<HomeProjectTask> HomeProjectTasks => Set<HomeProjectTask>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Family configuration
        modelBuilder.Entity<Family>()
            .HasIndex(f => f.Name)
            .IsUnique();

        // User configuration - unique name per family
        modelBuilder.Entity<User>()
            .HasIndex(u => new { u.Name, u.FamilyId })
            .IsUnique();
        
        modelBuilder.Entity<User>()
            .HasOne(u => u.Family)
            .WithMany()
            .HasForeignKey(u => u.FamilyId)
            .OnDelete(DeleteBehavior.Restrict);

        // Category configuration - unique name per family
        modelBuilder.Entity<Category>()
            .HasIndex(c => new { c.Name, c.FamilyId })
            .IsUnique();
        
        modelBuilder.Entity<Category>()
            .HasOne(c => c.Family)
            .WithMany()
            .HasForeignKey(c => c.FamilyId)
            .OnDelete(DeleteBehavior.Restrict);

        // IncomeSource configuration - unique name per family
        modelBuilder.Entity<IncomeSource>()
            .HasIndex(s => new { s.Name, s.FamilyId })
            .IsUnique();
        
        modelBuilder.Entity<IncomeSource>()
            .HasOne(i => i.Family)
            .WithMany()
            .HasForeignKey(i => i.FamilyId)
            .OnDelete(DeleteBehavior.Restrict);

        // Budget configuration
        modelBuilder.Entity<Budget>()
            .HasOne(b => b.Family)
            .WithMany()
            .HasForeignKey(b => b.FamilyId)
            .OnDelete(DeleteBehavior.Restrict);

        // Expense configuration
        modelBuilder.Entity<Expense>()
            .HasOne(e => e.Family)
            .WithMany()
            .HasForeignKey(e => e.FamilyId)
            .OnDelete(DeleteBehavior.Restrict);

        // Income configuration
        modelBuilder.Entity<Income>()
            .HasOne(i => i.Family)
            .WithMany()
            .HasForeignKey(i => i.FamilyId)
            .OnDelete(DeleteBehavior.Restrict);

        // Reimbursement configuration
        modelBuilder.Entity<Reimbursement>()
            .HasOne(r => r.Family)
            .WithMany()
            .HasForeignKey(r => r.FamilyId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}