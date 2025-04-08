namespace FinanceAsistant.API.DTOs;

public class CategoryCreateDto
{
    public int UserId { get; set; }
    public string Name { get; set; }
    public string Type { get; set; } // Income or Expense
}