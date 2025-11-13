using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace mathew.entities;

public class Reimbursement
{
    public int Id { get; set; }

    [Required]
    [Column(TypeName = "decimal(18,2)")]
    public decimal Amount { get; set; }

    [Required]
    public int ExpenseId { get; set; }
    public Expense Expense { get; set; }

    [Required]
    public string UserName { get; set; }

    [Required]
    public int Percentage { get; set; }

    [Required] public bool Pending { get; set; }
}