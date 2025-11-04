using System.ComponentModel.DataAnnotations;

namespace mathew.entities;

public class Category
{
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Description { get; set; }
    [MaxLength(50)]
    public string? Icon { get; set; }
    [MaxLength(50)]
    public string? Color { get; set; }
}