using Microsoft.EntityFrameworkCore;
using UserApi.Models;

namespace UserApi.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Account> Accounts { get; set; }
        public DbSet<Signin> Signins { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
                .Property(u => u.ActiveMsg)
                .HasConversion<string>();

            modelBuilder.Entity<Signin>()
                .Property(s => s.AccessMsg)
                .HasConversion<string>();

            modelBuilder.Entity<User>()
                .HasOne(u => u.AccountNavigation)
                .WithMany(a => a.Users)
                .HasForeignKey(u => u.Account)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Signin>()
                .HasOne(s => s.UserNavigation)
                .WithMany(u => u.Signins)
                .HasForeignKey(s => s.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            base.OnModelCreating(modelBuilder);
        }
    }
}
