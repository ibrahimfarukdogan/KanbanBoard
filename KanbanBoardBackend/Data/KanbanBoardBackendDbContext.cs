using KanbanBoardBackend.Models;
using Microsoft.EntityFrameworkCore;

namespace KanbanBoardBackend.Data
{
    public class KanbanBoardBackendDbContext:DbContext
    {
        public KanbanBoardBackendDbContext(DbContextOptions<KanbanBoardBackendDbContext> options) : base(options) { }
        public DbSet<Boards> Boards { get; set; }
        public DbSet<Lists> Lists { get; set; }
        public DbSet<Cards> Cards { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder) //Explicit Foreign Key implementation
        {
            base.OnModelCreating(modelBuilder);

            // Board - List (One-to-Many)
            modelBuilder.Entity<Lists>()
                .HasOne(l => l.Board)
                .WithMany(b => b.Lists)
                .HasForeignKey(l => l.BoardId)
                .OnDelete(DeleteBehavior.Cascade);  // Optionally, set delete behavior

            // List - Card (One-to-Many)
            modelBuilder.Entity<Cards>()
                .HasOne(c => c.List)
                .WithMany(l => l.Cards)
                .HasForeignKey(c => c.ListId)
                .OnDelete(DeleteBehavior.Cascade);  // Optionally, set delete behavior
        }
    }
}
