using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace mathew.entities;

public class HomeProjectTask
{
    public int Id { get; set; }

    [Required]
    public int HomeProjectId { get; set; }

    [Required]
    public string Description { get; set; }

    public DateTimeOffset CreationDate { get; set; } = DateTime.Now;

    public bool Done { get; set; }
}

