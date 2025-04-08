namespace FinanceAsistant.API.DTOs;

public class IncomeListDto
{
    public int Id { get; set; }
    public decimal Amount { get; set; }
    public string CategoryName { get; set; } = null!;
    public string CategoryType { get; set; } = null!;
    public string? Description { get; set; }
    public DateTime Date { get; set; }
}