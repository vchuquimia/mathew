using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace mathew.entities;

public class ShoppingListItem
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;

    public decimal BudgetAmount { get; set; }
    public int CategoryId { get; set; }
    public Category? Category { get; set; }
    public int ShoppingListId { get; set; }
    [JsonIgnore]
    public ShoppingList? ShoppingList { get; set; }
    public bool Done { get; set; }
}
