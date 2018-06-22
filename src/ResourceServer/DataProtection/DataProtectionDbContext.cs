using Microsoft.EntityFrameworkCore;

namespace ResourceServer.DataProtection
{
    public class DataProtectionDbContext : DbContext
    {
        public DbSet<DataProtectionElement> DataProtectionXMLElements { get; set; }

        public DataProtectionDbContext(DbContextOptions<DataProtectionDbContext> options) : base(options)
        {
        }
    }
}
