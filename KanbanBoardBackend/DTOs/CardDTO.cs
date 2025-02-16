﻿namespace KanbanBoardBackend.DTOs
{
    public class CardDTO
    {
        public string Title { get; set; }
        public string? Description { get; set; }
        public string? Tag { get; set; }
        public string Color { get; set; }
        public int Order { get; set; }
    }
}
