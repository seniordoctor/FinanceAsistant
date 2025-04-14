using FinanceAsistant.API.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FinanceAsistant.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AnalyticsController : ControllerBase
{
    private readonly FinanceDbContext _context;

    public AnalyticsController(FinanceDbContext context)
    {
        _context = context;
    }
    
    [HttpGet("monthly-summary/{userId}")]
    public async Task<IActionResult> GetMonthlySummary(int userId)
    {
        var now = DateTime.Now; // UtcNow yerine Now!
        var startDate = now.AddMonths(-5);

        var incomes = await _context.Incomes
            .Where(i => i.UserId == userId && i.Date >= startDate)
            .ToListAsync();

        var expenses = await _context.Expenses
            .Where(e => e.UserId == userId && e.Date >= startDate)
            .ToListAsync();

        var summary = Enumerable.Range(0, 6).Select(i =>
        {
            var month = startDate.AddMonths(i);
            var label = month.ToString("MMM yyyy", new System.Globalization.CultureInfo("tr-TR"));

            var incomeSum = incomes
                .Where(x => x.Date.Date >= new DateTime(month.Year, month.Month, 1) &&
                            x.Date.Date < new DateTime(month.Year, month.Month, 1).AddMonths(1))
                .Sum(x => x.Amount);

            var expenseSum = expenses
                .Where(x => x.Date.Month == month.Month && x.Date.Year == month.Year)
                .Sum(x => x.Amount);

            return new
            {
                Month = label,
                Income = incomeSum,
                Expense = expenseSum
            };
        });

        return Ok(summary);
    }
}