using FluentValidation;
using KanbanBoardBackend.Data;
using KanbanBoardBackend.Models;

namespace KanbanBoardBackend.Validators
{
    public class BoardsValidator : AbstractValidator<Boards>
    {
        private readonly KanbanBoardBackendDbContext _context;

        // Constructor with dependency injection of DbContext
        public BoardsValidator(KanbanBoardBackendDbContext context)
        {
            _context = context;
            RuleFor(boards => boards.Title).NotNull().Must(BeUniqueBoard).WithMessage("Board title must be unique.");
        }

        // Unique check using injected DbContext
        private bool BeUniqueBoard(string title)
        {
            return !_context.Boards.Any(x => x.Title == title);
        }
    }
}