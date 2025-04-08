namespace FinanceAsistant.API.DTOs;

public class ExpenseListDto
{
    public int Id { get; set; }
    public decimal Amount { get; set; }
    public string CategoryName { get; set; } = null!;
    public string CategoryType { get; set; } = null!;
    public string? Description { get; set; }
    public DateTime Date { get; set; }
}