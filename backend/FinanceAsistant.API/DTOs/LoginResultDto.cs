namespace FinanceAsistant.API.DTOs;

public class LoginResultDto
{
    public string Token { get; set; } = null!;
    public string FullName { get; set; } = null!;
    public string Email { get; set; } = null!;
    public int UserId { get; set; }

}