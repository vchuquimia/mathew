
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using mathew.entities;
namespace mathew.entities;

public class
    Income
{
    public int Id { get; set; }

    [Required]
    [Column(TypeName = "decimal(18,2)")]
    public decimal Amount { get; set; }

    [Required]
    [MaxLength(500)]
    public string Description { get; set; } = string.Empty;

    [Required]
    public DateTime Date { get; set; }

    [Required]
    public string UserName { get; set; }
    public int IncomeSourceId { get; set; }

    public IncomeSource IncomeSource { get; set; } = null!;
}