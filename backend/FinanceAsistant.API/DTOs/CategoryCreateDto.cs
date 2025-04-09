public class CategoryCreateDto
{
    public string Name { get; set; } = null!;
    public string Type { get; set; } = null!; // "Income" / "Expense"
    public int? UserId { get; set; } // 👈 bu şekilde olmalı
}