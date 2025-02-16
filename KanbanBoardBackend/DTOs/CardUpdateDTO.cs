namespace KanbanBoardBackend.DTOs
{
    public class CardUpdateDTO
    {
        public int Id { get; set; }
        public required string Title { get; set; }
        public string? Description { get; set; }
        public string? Color { get; set; } = "Blue";
        public string? Tag { get; set; }
    }
}
