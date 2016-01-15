using Microsoft.AspNet.Builder;
using System.Security.Cryptography.X509Certificates;
using Microsoft.Dnx.Runtime;
using IdentityServerAspNet5WithIdentity.AspNetIdentity;
using IdentityServerAspNet5WithIdentity.Configuration;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.Data.Entity;
using Microsoft.AspNet.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.PlatformAbstractions;

namespace IdentityServerAspNet5WithIdentity
{
    using System.IO;

    using IdentityServerAspNet5WithIdentity.UI;
    using IdentityServerAspNet5WithIdentity.UI.Login;

    public class Startup
    {
        public IConfigurationRoot Configuration { get; set; }

        private readonly IApplicationEnvironment _environment;

        public Startup(IHostingEnvironment env, IApplicationEnvironment environment)
        {
            _environment = environment;

            var builder = new ConfigurationBuilder()
                .SetBasePath(environment.ApplicationBasePath)
                .AddJsonFile("config.json");
            Configuration = builder.Build();
        }

        public void ConfigureServices(IServiceCollection services)
        {
            var connection = Configuration["Production:SqliteConnectionString"];

            services.AddEntityFramework()
                .AddSqlite()
                .AddDbContext<MyIdentityDbContext>(options => options.UseSqlite(connection));

            services.AddIdentity<MyUser, IdentityRole>(options =>
            {
                options.Password.RequireDigit = false;
                options.Password.RequireLowercase = false;
                options.Password.RequireNonLetterOrDigit = false;
                options.Password.RequireUppercase = false;
                options.Password.RequiredLength = 6;
            })
                .AddEntityFrameworkStores<MyIdentityDbContext>()
                .AddDefaultTokenProviders();

            var cert = new X509Certificate2(Path.Combine(_environment.ApplicationBasePath, "damienbodserver.pfx"), "");

            var builder = services.AddIdentityServer(options =>
            {
                options.SigningCertificate = cert;
            });

            builder.AddInMemoryClients(Clients.Get());
            builder.AddInMemoryScopes(Scopes.Get());
            builder.AddInMemoryUsers(Users.Get());

            // for the UI
            services
                .AddMvc()
                .AddRazorOptions(razor =>
                {
                    razor.ViewLocationExpanders.Add(new CustomViewLocationExpander());
                });
            services.AddTransient<LoginService>();
        }

        public void Configure(IApplicationBuilder app, IApplicationEnvironment env)
        {
            app.UseIISPlatformHandler();
            app.UseDeveloperExceptionPage();

            app.UseIdentity();

            app.UseIdentityServer();
        }

        public static void Main(string[] args) => WebApplication.Run<Startup>(args);
    }
}