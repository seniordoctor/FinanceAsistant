using FinanceAsistant.API.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FinanceAsistant.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AdviceController : ControllerBase
{
    private readonly FinanceDbContext _context;

    public AdviceController(FinanceDbContext context)
    {
        _context = context;
    }

    [HttpGet("{userId}")]
    public async Task<IActionResult> GetAdvice(int userId)
    {
        var income = await _context.Incomes
            .Where(i => i.UserId == userId)
            .SumAsync(i => i.Amount);

        var expense = await _context.Expenses
            .Where(e => e.UserId == userId)
            .SumAsync(e => e.Amount);

        var installments = await _context.Installments
            .Where(i => i.UserId == userId)
            .ToListAsync();

        decimal monthlyInstallment = 0;

        foreach (var i in installments)
        {
            var now = DateTime.Now;
            var monthsPassed = (now.Year - i.StartDate.Year) * 12 + now.Month - i.StartDate.Month;
            if (monthsPassed >= 0 && monthsPassed < i.TotalMonths)
            {
                monthlyInstallment += i.MonthlyAmount;
            }
        }

        var messages = new List<string>();

        if (income == 0)
        {
            messages.Add("Henüz gelir bilgisi girilmediği için öneri sunulamıyor.");
        }
        else
        {
            var savingTarget = income * 0.10m;
            var available = income - expense - monthlyInstallment;

            if (expense > income * 0.8m)
                messages.Add("Giderlerin gelirinin %80'inden fazla. Harcamalarını gözden geçir.");
            else
                messages.Add("Giderlerin kontrollü. Harcamalarını bu seviyede tutmaya devam et.");

            if (monthlyInstallment > income * 0.3m)
                messages.Add(
                    "Taksit yükün yüksek görünüyor (%30'dan fazla). Daha az taksitli alışveriş yapmaya dikkat et.");
            else
                messages.Add("Taksit oranların iyi seviyede. Kredi yönetimin başarılı görünüyor.");

            if (available >= savingTarget)
                messages.Add(
                    $"Bu ay {available:N0} ₺ birikim yapabilirsin. En az {savingTarget:N0} ₺ yatırım hedefini tutturuyorsun.");
            else if (available > 0)
                messages.Add(
                    $"Bu ay {available:N0} ₺ gibi düşük bir birikim imkanı görünüyor. Harcamalarını biraz kısarak artırabilirsin.");
            else
                messages.Add(
                    "Bu ay eksiye düşüyorsun. Önceliğin sabit harcamalarını azaltmak ve gelir artırmak olmalı.");
        }

        return Ok(new
        {
            TotalIncome = income,
            TotalExpense = expense,
            MonthlyInstallment = monthlyInstallment,
            Advice = messages
        });
    }
}