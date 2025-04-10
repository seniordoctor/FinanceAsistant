using FinanceAsistant.API.Data;
using FinanceAsistant.API.DTOs;
using FinanceAsistant.API.Entities;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FinanceAsistant.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ExpensesController : ControllerBase
{
    private readonly FinanceDbContext _context;

    public ExpensesController(FinanceDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllExpenses()
    {
        var expenses = await _context.Expenses
            .Include(e => e.Category)
            .OrderByDescending(e => e.Date)
            .Select(e => new ExpenseListDto
            {
                Id = e.Id,
                Amount = e.Amount,
                CategoryName = e.Category.Name,
                CategoryType = e.Category.Type,
                Description = e.Description,
                Date = e.Date.ToUniversalTime()
            })
            .ToListAsync();

        return Ok(expenses);
    }

    [HttpGet("summary-by-category")]
    public async Task<IActionResult> GetExpenseSummaryByCategory()
    {
        var today = DateTime.Today;
        var firstOfMonth = new DateTime(today.Year, today.Month, 1);
        var nextMonth = firstOfMonth.AddMonths(1);

        var result = await _context.Expenses
            .Include(e => e.Category)
            .Where(e => e.Date >= firstOfMonth && e.Date < nextMonth)
            .GroupBy(e => e.Category.Name)
            .Select(g => new CategoryExpenseSummaryDto
            {
                Category = g.Key,
                TotalAmount = g.Sum(x => x.Amount),
            })
            .OrderByDescending(x => x.TotalAmount)
            .ToListAsync();

        return Ok(result);
    }

    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetExpenseByUser(int userId)
    {
        var expenses = await _context.Expenses
            .Where(e => e.UserId == userId)
            .OrderByDescending(e => e.Date)
            .ToListAsync();

        return Ok(expenses);
    }

    [HttpGet("summary/{userId}")]
    public async Task<IActionResult> GetExpenseSummaryByUserId(int userId)
    {
        var total = await _context.Expenses
            .Where(e => e.UserId == userId)
            .SumAsync(e => e.Amount);

        return Ok(new { totalExpense = total });
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetExpenseById(int id)
    {
        var expense = await _context.Expenses.FindAsync(id);
        if (expense == null) return NotFound();

        return Ok(expense);
    }

    [HttpPost]
    public async Task<IActionResult> AddExpense([FromBody] ExpenseCreateDto dto)
    {
        var expense = new Expense
        {
            UserId = dto.UserId,
            Amount = dto.Amount,
            CategoryId = dto.CategoryId,
            Description = dto.Description,
            Date = dto.Date.ToUniversalTime()
        };

        _context.Expenses.Add(expense);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetAllExpenses), new { id = expense.Id }, expense);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteExpense(int id)
    {
        var expense = await _context.Expenses.FindAsync(id);
        if (expense == null)
            return NotFound();

        _context.Expenses.Remove(expense);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}