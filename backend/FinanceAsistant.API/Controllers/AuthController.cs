using FinanceAsistant.API.Data;
using FinanceAsistant.API.DTOs;
using FinanceAsistant.API.Entities;
using FinanceAsistant.API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace FinanceAsistant.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly FinanceDbContext _context;
    private readonly JwtService _jwtService;

    public AuthController(FinanceDbContext context, JwtService jwtService)
    {
        _context = context;
        _jwtService = jwtService;
    }
    
    // 🔐 REGISTER
    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDto dto)
    {
        var emailExist = await _context.Users
            .AnyAsync(u => u.Email == dto.Email);
        if (emailExist)
            return BadRequest("Bu email adresi zaten kullanılıyor");

        var user = new User
        {
            FullName = dto.FullName,
            Email = dto.Email,
            PasswordHash = HashPassword(dto.Password),
            IsApproved = false, // admin onayını beklesin
            IsAdmin = false
        };
        
        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        
        return Ok("Kayıt başarılı. Admin onayından sonra giriş yapabilirsiniz.");
    }
    
    // 🔑 LOGIN
    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto dto)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == dto.Email);

        if (user == null || !VerifyPassword(dto.Password, user.PasswordHash))
            return Unauthorized("Geçersiz kullanıcı veya şifre.");

        if (!user.IsApproved)
            return Forbid("Hesabınız henüz admin tarafından onaylanmamış.");
        
        var token = _jwtService.GenerateToken(user);

        return Ok(new LoginResultDto
        {
            Token = token,
            FullName = user.FullName,
            Email = user.Email,
            UserId = user.Id
        });
    }
    
    // 🔐 SHA256 Hashing
    private static string HashPassword(string password)
    {
        using var sha = SHA256.Create();
        var bytes = Encoding.UTF8.GetBytes(password);
        var hash = sha.ComputeHash(bytes);
        return Convert.ToBase64String(hash);
    }

    private static bool VerifyPassword(string input, string hash)
        => HashPassword(input) == hash;
}