﻿using FinanceAsistant.API.Data;
using FinanceAsistant.API.DTOs;
using FinanceAsistant.API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FinanceAsistant.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class IncomesController : ControllerBase
{
    private readonly FinanceDbContext _context;

    public IncomesController(FinanceDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllIncomes()
    {
        var incomes = await _context.Incomes
            .Include(i => i.Category)
            .OrderByDescending(i => i.Date)
            .Select(i => new IncomeListDto
            {
                Id = i.Id,
                Amount = i.Amount,
                CategoryName = i.Category.Name,
                CategoryType = i.Category.Type,
                Description = i.Description,
                Date = i.Date,
            })
            .ToListAsync();

        return Ok(incomes);
    }

    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetIncomesByUser(int userId)
    {
        var incomes = await _context.Incomes
            .Where(i => i.UserId == userId)
            .OrderByDescending(i => i.Date)
            .ToListAsync();
        
        return Ok(incomes);
    }

    [HttpGet("summary/{userId}")]
    public async Task<IActionResult> GetIncomeSummaryByUserId(int userId)
    {
        var total = await _context.Incomes
            .Where(i => i.UserId == userId)
            .SumAsync(i => i.Amount);
        
        return Ok(new { totalIncome = total });
    }
    
    [HttpGet("{id}")]
    public async Task<IActionResult> GetIncomeById(int id)
    {
        var income = await _context.Incomes.FindAsync(id);
        if (income == null) return NotFound();

        return Ok(income);
    }
    
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteIncome(int id)
    {
        var income = await _context.Incomes.FindAsync(id);
        if (income == null)
            return NotFound();

        _context.Incomes.Remove(income);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] IncomeCreateDto dto)
    {
        var income = new Income
        {
            UserId = dto.UserId,
            Amount = dto.Amount,
            CategoryId = dto.CategoryId,
            Description = dto.Description,
            Date = dto.Date,
        };

        _context.Incomes.Add(income);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetAllIncomes), new { id = income.Id }, income);
    }
}