using FinanceAsistant.API.Data;
using FinanceAsistant.API.DTOs;
using FinanceAsistant.API.Entities;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FinanceAsistant.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class InstallmentsController : ControllerBase
{
    private readonly FinanceDbContext _context;

    public InstallmentsController(FinanceDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllInstallments()
    {
        var today = DateTime.UtcNow;

        var installments = await _context.Installments
            .OrderBy(i => i.StartDate)
            .Select(i => new InstallmentListDto
            {
                Id = i.Id,
                Title = i.Title,
                MonthlyAmount = i.MonthlyAmount,
                StartDate = i.StartDate,
                EndDate = i.StartDate.AddMonths(i.TotalMonths),
                MonthsRemaining = i.StartDate.AddMonths(i.TotalMonths) > today
                    ? ((i.StartDate.AddMonths(i.TotalMonths).Year - today.Year) * 12 +
                        i.StartDate.AddMonths(i.TotalMonths).Month - today.Month)
                    : 0
            })
            .ToListAsync();

        return Ok(installments);
    }

    [HttpGet("monthly-total")]
    public async Task<IActionResult> GetMonthlyInstallmentTotal()
    {
        var today = DateTime.Today;
        
        var total = _context.Installments
            .Where(i => i.StartDate <= today && i.StartDate.AddMonths(i.TotalMonths) > today)
            .Sum(i => i.MonthlyAmount);

        return Ok(new { Total = total });
    }

    [HttpGet("active")]
    public async Task<IActionResult> GetActiveInstallments()
    {
        var today = DateTime.Today;

        var result = _context.Installments
            .Where(i => i.StartDate <= today && i.StartDate.AddMonths(i.TotalMonths) > today)
            .ToListAsync();
        
        return Ok(result);
    }

    [HttpGet("ending-soon")]
    public async Task<IActionResult> GetInstallmentEndingSoon()
    {
        var today = DateTime.Today;
        var firstOfMonth = new DateTime(today.Year, today.Month, 1);
        var firstOfNextMonth = firstOfMonth.AddMonths(1);

        var result = _context.Installments
            .Where(i =>
                i.StartDate.AddMonths(i.TotalMonths) >= firstOfMonth &&
                i.StartDate.AddMonths(i.TotalMonths) < firstOfNextMonth)
            .ToListAsync();
        
        return Ok(result);
    }

    [HttpGet("monthly/{userId}")]
    public async Task<IActionResult> GetMonthlyInstallmentByUserId(int userId)
    {
        var today = DateTime.UtcNow;
        
        var total = await _context.Installments
            .Where(i => i.UserId == userId)
            .Where(i =>
                i.StartDate <= today &&
                i.StartDate.AddMonths(i.TotalMonths) > today
                )
            .SumAsync(i => i.MonthlyAmount);

        return Ok(new { monthlyInstallment = total });
    }

    [HttpPost]
    public async Task<IActionResult> AddInstallment([FromBody] InstallmentCreateDto dto)
    {
        var installment = new Installment
        {
            UserId = dto.UserId,
            Title = dto.Title,
            MonthlyAmount = dto.MonthlyAmount,
            TotalMonths = dto.TotalMonths,
            StartDate = dto.StartDate,
        };

        _context.Installments.Add(installment);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetAllInstallments), new { id = installment.Id }, installment);
    }
}