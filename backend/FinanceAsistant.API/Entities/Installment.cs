namespace FinanceAsistant.API.Entities;

public class Installment
{
    public int Id { get; set; }
    public int UserId { get; set; }

    public string Title { get; set; } = null!;
    public decimal MonthlyAmount { get; set; }
    public int TotalMonths { get; set; }

    public DateTime StartDate { get; set; }

    public User User { get; set; } = null!;
}