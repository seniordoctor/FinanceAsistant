public class Category
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public string Type { get; set; } = null!; // "Income" / "Expense"
    public int? UserId { get; set; } // null → genel kategori
}