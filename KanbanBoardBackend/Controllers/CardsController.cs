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
    public class CardsController : ControllerBase
    {
        private readonly KanbanBoardBackendDbContext _context;

        public CardsController(KanbanBoardBackendDbContext context)
        {
            _context = context;
        }

        // GET: api/Cards
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Cards>>> GetCards()
        {
            return await _context.Cards.ToListAsync();
        }

        // GET: api/Cards/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Cards>> GetCards(int id)
        {
            var cards = await _context.Cards.FindAsync(id);

            if (cards == null)
            {
                return NotFound();
            }

            return cards;
        }

        [HttpGet("cards/{id}")]
        public async Task<ActionResult<CardUpdateDTO>> GetCardsFromBoards(int id)
        {
            var card = await _context.Cards.FindAsync(id);

            if (card == null)
            {
                return NotFound();
            }
            var cardUpdateDTO = new CardUpdateDTO
            {
                Id = card.Id,
                Title = card.Title,
                Description = card.Description,
                Color = card.Color,
                Tag = card.Tag
            };

            return cardUpdateDTO;
        }
        // PUT: api/Cards/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCards(int id, Cards cards)
        {
            if (id != cards.Id)
            {
                return BadRequest();
            }

            _context.Entry(cards).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CardsExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        [HttpPut("{Title}/lists/{listId}/cards/{id}")]
        public async Task<IActionResult> PutCardsFromBoards(string title, int listId, int id, CardUpdateDTO cards)
        {
            if (id != cards.Id)
            {
                return BadRequest();
            }
            var list = await _context.Lists.FirstOrDefaultAsync(l => l.Id == listId);

            if (list == null)
            {
                return BadRequest("List not found.");
            }

            // Check if the board exists
            var board = await _context.Boards.FirstOrDefaultAsync(b => b.Title == title && b.Id == list.BoardId);

            if (board == null)
            {
                return BadRequest("Board not found or the list does not belong to the specified board.");
            }

            var card = await _context.Cards
                .Include(c => c.List)  // Make sure to include the List navigation property
                .FirstOrDefaultAsync(c => c.Id == id);

            if (card == null)
            {
                return NotFound("Card not found.");
            }
            card.Title = cards.Title;
            card.Description = cards.Description;
            card.Color = cards.Color;
            card.Tag = cards.Tag;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }

            return NoContent();
        }

        // POST: api/Cards
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost("{Title}/lists/{listId}/cards")]
        public async Task<IActionResult> PostCards(string title, int listId, [FromBody] CardDTO card)
        {
            if (card == null)
            {
                return BadRequest("Card data is required.");
            }
            var list = await _context.Lists.FirstOrDefaultAsync(l => l.Id == listId);

            if (list == null)
            {
                return BadRequest("List not found.");
            }

            // Check if the board exists
            var board = await _context.Boards.FirstOrDefaultAsync(b => b.Title == title && b.Id == list.BoardId);

            if (board == null)
            {
                return BadRequest("Board not found or the list does not belong to the specified board.");
            }

            // Find the highest order value in the current list
            var highestOrder = await _context.Cards
                .Where(c => c.ListId == listId)
                .MaxAsync(c => (int?)c.Order) ?? 0; // If no cards exist, default to 0

            var newcard = new Cards
            {
                Title = card.Title,
                Description = card.Description,
                Color = card.Color,
                Tag = card.Tag,
                Order = highestOrder + 1, // Auto increment the order
                ListId = listId, // Set the ListId from the route
                List = list // Associate the List entity (optional, depending on EF configuration)
            };

            // Add the new card to the context
            _context.Cards.Add(newcard);
            await _context.SaveChangesAsync();

            // Return the newly created card
            return CreatedAtAction("GetCards", new { id = newcard.Id }, newcard);
        }

        // PATCH: api/Cards/cardlist
        [HttpPatch("{id}/cardlist")]
        public async Task<IActionResult> PatchCardList(int id, [FromBody] int newListId)
        {
            var card = await _context.Cards
                .Include(c => c.List)  // Make sure to include the List navigation property
                .FirstOrDefaultAsync(c => c.Id == id);

            if (card == null)
            {
                return NotFound("Card not found.");
            }

            // Get the List the card currently belongs to and Remove from it
            var oldList = card.List;
            if (oldList == null)
            {
                return NotFound("The old List was not found.");
            }
            oldList.Cards.Remove(card);

            // Check if the new ListId is different and if the List exists initate an update
            card.ListId = newListId;
            var newList = await _context.Lists.FirstOrDefaultAsync(l => l.Id == newListId);
            if (newList == null)
            {
                return NotFound("The new List was not found.");
            }
            newList.Cards.Add(card);
                        
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // PATCH: api/Cards/cardsorder
        [HttpPatch("cardsorder")]
        public async Task<IActionResult> PatchCardOrder([FromBody] List<CardOrderDTO> cards)
        {

            foreach (var card in cards)
            {
                var dbCard = await _context.Cards.FindAsync(card.Id);
                if (dbCard != null)
                {
                    dbCard.Order = card.Order;
                }
            }
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }

            return NoContent();
        }
        // DELETE: api/Cards/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCards(int id)
        {
            var cards = await _context.Cards.FindAsync(id);
            if (cards == null)
            {
                return NotFound();
            }

            _context.Cards.Remove(cards);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("lists/{listId}/cards/{cardId}")]
        public async Task<IActionResult> DeleteCardsFromBoards(int listId, int cardId)
        {
            var card = await _context.Cards.FindAsync(cardId);
            if (card == null)
            {
                return NotFound();
            }

            var list = await _context.Lists.FirstOrDefaultAsync(l => l.Id == listId);

            if (list == null)
            {
                return BadRequest("List not found.");
            }

            list.Cards.Remove(card);
            _context.Cards.Remove(card);
            await _context.SaveChangesAsync();

            return NoContent();
        }


        private bool CardsExists(int id)
        {
            return _context.Cards.Any(e => e.Id == id);
        }
    }
}
