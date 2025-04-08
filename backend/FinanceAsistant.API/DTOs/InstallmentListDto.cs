namespace FinanceAsistant.API.DTOs;

public class InstallmentListDto
{
    public int Id { get; set; }
    public string Title { get; set; } = null!;
    public decimal MonthlyAmount { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }     // otomatik hesaplanacak
    public int MonthsRemaining { get; set; }  // bugüne göre kalan ay
}