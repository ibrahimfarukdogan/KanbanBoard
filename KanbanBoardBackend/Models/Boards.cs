using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Security.Policy;
using FluentValidation;
using KanbanBoardBackend.Models;

namespace KanbanBoardBackend.Models
{
    public class Boards
    {
        [Key]
        public int Id { get; set; }
        public required string Title { get; set; }
        public required string CreatorName { get; set; }
        public ICollection<Lists> Lists { get; set; } = new List<Lists>();
    }

}
