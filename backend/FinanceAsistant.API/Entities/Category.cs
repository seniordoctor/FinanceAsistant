namespace FinanceAsistant.API.Entities;

public class Category
{
    public int Id { get; set; }
    public int UserId { get; set; }
    
    public string Name { get; set; } = null!;
    public string? Type { get; set; } = null!; // Income or Expense
    
    public User User { get; set; } = null!;
}