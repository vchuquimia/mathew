public class ExpenseSummaryDto
{
    public int CategoryId { get; set; }
    public decimal TotalAmount { get; set; }
    public int ExpenseCount { get; set; }
    public decimal BudgetAmount { get; set; }
    public decimal RemainingBudget { get; set; }
    public decimal BudgetUsedPercentage { get; set; }
}