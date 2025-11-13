using System.ComponentModel.DataAnnotations;
namespace mathew.entities;
public class User
{
    public int Id { get; set; }

    [Required]
    public string Name { get; set; }
    [Required]
    public string Password { get; set; }
    [Required]
    public string ColorClass { get; set; }
}