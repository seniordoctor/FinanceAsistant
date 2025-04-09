using FinanceAsistant.API.Data;
using FinanceAsistant.API.DTOs;
using FinanceAsistant.API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FinanceAsistant.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly FinanceDbContext _context;

    public CategoriesController(FinanceDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllCategories()
    {
        var categories = await _context.Categories
            .OrderBy(c => c.Type)
            .ThenBy(c => c.Name)
            .ToListAsync();
        
        return Ok(categories);
    }
    
    [HttpGet("income/{userId}")]
    public async Task<IActionResult> GetIncomeCategoriesByUserId(int userId)
    {
        var categories = await _context.Categories
            .Where(c => c.Type == "Income" && (c.UserId == null || c.UserId == userId))
            .OrderBy(c => c.Name)
            .ToListAsync();

        return Ok(categories);
    }
    
    [HttpGet("expense/{userId}")]
    public async Task<IActionResult> GetExpenseCategoriesByUserId(int userId)
    {
        var categories = await _context.Categories
            .Where(c => c.Type == "Expense" && (c.UserId == null || c.UserId == userId))
            .OrderBy(c => c.Name)
            .ToListAsync();

        return Ok(categories);
    }

    [HttpPost]
    public async Task<IActionResult> AddCategory([FromBody] CategoryCreateDto dto)
    {
        var category = new Category
        {
            UserId = dto.UserId,
            Name = dto.Name,
            Type = dto.Type
        };
        
        _context.Categories.Add(category);
        await _context.SaveChangesAsync();
        
        return CreatedAtAction(nameof(GetAllCategories), new { id = category.Id }, category);
    }
}