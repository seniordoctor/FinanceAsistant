namespace FinanceAsistant.API.DTOs;

public class CategoryExpenseSummaryDto
{
    public string Category { get; set; } = null!;
    public decimal TotalAmount { get; set; }
}