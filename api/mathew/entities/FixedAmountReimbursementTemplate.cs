using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace mathew.entities;

public class FixedAmountReimbursementTemplate
{
    public int Id { get; set; }

    [Required]
    public string Name { get; set; } = string.Empty;

    [Required]
    [Column(TypeName = "decimal(18,2)")]
    public decimal FixedAmount { get; set; }

    [Required]
    public int NumberOfPayments { get; set; }

    [Required]
    public string PaymentDescriptionTemplate { get; set; } = string.Empty;

    [Required]
    public string UserName { get; set; } = string.Empty;

    [Required]
    public int FamilyId { get; set; }

    public Family? Family { get; set; }
}

