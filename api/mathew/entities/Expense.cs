using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using mathew.entities;

namespace mathew.entities;
public class Expense
{
    public int Id { get; set; }

    [Required]
    [Column(TypeName = "decimal(18,2)")]
    public decimal Amount { get; set; }

    [Required]
    [MaxLength(500)]
    public string Description { get; set; } = string.Empty;

    [Required]
    public DateTimeOffset Date { get; set; }

    [Required]
    public int CategoryId { get; set; }

    public Category? Category { get; set; } = null!;
    [Required]
    public string RegisteredBy { get; set; }


}