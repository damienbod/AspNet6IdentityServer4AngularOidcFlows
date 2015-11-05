using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AspNet5SQLite.Model
{
    // >dnx . ef migration add testMigration

    public class DataEventRecord
    {
        public long Id { get; set; }
        public string Name { get; set; }

        public string Description { get; set; }

        public DateTime Timestamp { get; set; }
    }
}
