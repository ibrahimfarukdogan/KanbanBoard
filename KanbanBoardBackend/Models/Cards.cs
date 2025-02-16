using System.ComponentModel.DataAnnotations;

namespace KanbanBoardBackend.Models
{
    public class Cards
    {
        [Key]
        public int Id { get; set; }
        public required string Title { get; set; }
        public string? Description { get; set; }
        public string Color { get; set; } = "Blue";
        public string? Tag { get; set; }
        public int Order { get; set; }
        public required int ListId { get; set; }
        public required Lists List { get; set; } 
    }
}
