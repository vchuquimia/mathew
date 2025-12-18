using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace mathew.entities;

public class HomeProject
{
    public int Id { get; set; }

    [Required]
    public string Name { get; set; }

    [Required]
    public int FamilyId { get; set; }


    public ProjectStatus Status { get; set; }

    public string Description { get; set; }

    public ProjectFeedback? Feedback { get; set; }

    public string? FeedbackComment { get; set; }

    public DateTimeOffset CreationDate { get; set; } = DateTime.Now;

    public List<HomeProjectLog> Logs { get; set; } = new();
    public List<HomeProjectTask> Tasks { get; set; } = new();
}
