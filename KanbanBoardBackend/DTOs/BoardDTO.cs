namespace KanbanBoardBackend.DTOs
{
    public class BoardDTO
    {
        public string Title { get; set; }
        public string CreatorName { get; set; }
        public List<ListDTO> Lists { get; set; }
    }
}
