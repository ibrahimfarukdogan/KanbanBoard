using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace KanbanBoardBackend.Models
{
    public class Lists
    {
        [Key]
        public int Id { get; set; }
        public required string Title { get; set; }
        public required int BoardId { get; set; }
        public required Boards Board { get; set; }
        public ICollection<Cards> Cards { get; set; } = new List<Cards>();
    }
}
