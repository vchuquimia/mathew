using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace mathew.entities;

public class HomeTask
{
    public int Id { get; set; }

    [Required]
    public string Description { get; set; }

    public bool Done { get; set; }

    public DateTimeOffset DueDate { get; set; }

    [Range(0, 3)]
    public int? Rating { get; set; }

    public string? RatingComment { get; set; }

    [Required]
    public string UserName { get; set; }


    [Required]
    public int FamilyId { get; set; }
}

