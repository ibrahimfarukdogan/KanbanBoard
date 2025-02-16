namespace KanbanBoardBackend.DTOs
{
    public class ListDTO
    {
        public string Title { get; set; }
        public List<CardDTO> Cards { get; set; }
    }
}
