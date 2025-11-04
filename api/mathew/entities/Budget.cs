using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace mathew.entities;
public class Budget
{
    public int Id { get; set; }

    [Required]
    public int CategoryId { get; set; }

    [Required]
    [Column(TypeName = "decimal(18,2)")]
    public decimal Amount { get; set; }

    [Required]
    [Range(1, 12)]
    public int Month { get; set; }

    [Required]
    public int Year { get; set; }

    public Category Category { get; set; } = null!;
}