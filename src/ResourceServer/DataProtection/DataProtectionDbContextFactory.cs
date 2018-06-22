using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using System;
using System.IO;

namespace ResourceServer.DataProtection
{
    public class DataProtectionDbContextFactory : IDesignTimeDbContextFactory<DataProtectionDbContext>
    {
        public DataProtectionDbContext CreateDbContext(string[] args)
        {
            var deploymentType = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT", EnvironmentVariableTarget.Machine);

            var currentDirectory = Directory.GetCurrentDirectory();

            var configuration = new ConfigurationBuilder()
                .AddJsonFile($"{currentDirectory}\\appsettings.json")
                .Build();

            var connectionString = configuration.GetConnectionString("DefaultConnection");
            var optionsBuilder = new DbContextOptionsBuilder<DataProtectionDbContext>();
            optionsBuilder.UseSqlite(connectionString);

            return new DataProtectionDbContext(optionsBuilder.Options);
        }
    }
}
