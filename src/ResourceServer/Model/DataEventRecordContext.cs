namespace AspNet5SQLite.Model
{
    using Microsoft.Data.Entity;

    // >dnx . ef migration add testMigration
    public class DataEventRecordContext : DbContext
    {
        public DbSet<DataEventRecord> DataEventRecords { get; set; }
      
        protected override void OnModelCreating(ModelBuilder builder)
        { 
            builder.Entity<DataEventRecord>().HasKey(m => m.Id); 
            base.OnModelCreating(builder); 
        } 
    }
}