namespace FinanceAsistant.API.DTOs;

public class InstallmentCreateDto
{
    public int UserId { get; set; }
    public string Title { get; set; } = null!;
    public decimal MonthlyAmount { get; set; }
    public int TotalMonths { get; set; }
    public DateTime StartDate { get; set; }
}