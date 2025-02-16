using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using KanbanBoardBackend.Data;
using KanbanBoardBackend.Models;
using KanbanBoardBackend.DTOs;

namespace KanbanBoardBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BoardsController : ControllerBase
    {
        private readonly KanbanBoardBackendDbContext _context;

        public BoardsController(KanbanBoardBackendDbContext context)
        {
            _context = context;
        }

        // GET: api/Boards
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Boards>>> GetBoards()
        {
            return await _context.Boards.ToListAsync();
        }

        // GET: api/Boards/5

        [HttpGet("{Title}")]
        public async Task<IActionResult> GetBoardByTitle(string title)
        {
            var board = await _context.Boards
                .Include(b => b.Lists) // Include Lists related to the board
                .ThenInclude(l => l.Cards) // Include Cards related to each List
                .FirstOrDefaultAsync(b => b.Title == title);

            if (board == null)
            {
                return NotFound("Board not found");
            }

            var boardDTO = new BoardDTO
            {
                Title = board.Title,
                CreatorName = board.CreatorName,
                Lists = board.Lists.Select(l => new ListDTO
                {
                    Title = l.Title,
                    Cards = l.Cards.Select(c => new CardDTO
                    {
                        Title = c.Title,
                        Tag = c.Tag,
                        Color = c.Color
                    }).ToList()
                }).ToList()
            };

            return Ok(board);
        }

        // POST: api/Boards
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Boards>> PostBoards(Boards boards)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Boards.Add(boards);
            await _context.SaveChangesAsync();

            var defaultLists = new List<Lists> //creating default lists
            {
                new Lists { Title = "Backlog", BoardId = boards.Id, Board = boards }, // Setting both BoardId and Board
                new Lists { Title = "To Do", BoardId = boards.Id, Board = boards },
                new Lists { Title = "In Progress", BoardId = boards.Id, Board = boards },
                new Lists { Title = "Done", BoardId = boards.Id, Board = boards }
            };


            _context.Lists.AddRange(defaultLists); // Add lists to the context
            await _context.SaveChangesAsync(); // Save lists to the database

            return CreatedAtAction("GetBoards", new { id = boards.Id }, boards);
        }

        // DELETE: api/Boards/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBoards(int id)
        {
            var boards = await _context.Boards.FindAsync(id);
            if (boards == null)
            {
                return NotFound();
            }

            _context.Boards.Remove(boards);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool BoardsExists(int id)
        {
            return _context.Boards.Any(e => e.Id == id);
        }
    }
}
