using Microsoft.AspNet.Builder;
using Microsoft.Framework.DependencyInjection;
using System.Security.Cryptography.X509Certificates;
using IdentityServer3.Core.Configuration;
using Microsoft.Dnx.Runtime;
using IdentityServerAspNet5WithIdentity.AspNetIdentity;
using IdentityServerAspNet5WithIdentity.Configuration;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.Data.Entity;

namespace IdentityServerAspNet5WithIdentity
{
    using Microsoft.AspNet.Hosting;
    using Microsoft.Framework.Configuration;

    public class Startup
    {
        public IConfigurationRoot Configuration { get; set; }

        public Startup(IHostingEnvironment env, IApplicationEnvironment appEnv)
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(appEnv.ApplicationBasePath)
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

            services.AddDataProtection();
        }

        public void Configure(IApplicationBuilder app, IApplicationEnvironment env)
        {
            app.UseIISPlatformHandler();
            app.UseDeveloperExceptionPage();

            app.UseIdentity();

            var certFile = env.ApplicationBasePath + "\\damienbodserver.pfx";

            var idsrvOptions = new IdentityServerOptions
            {
                Factory = new IdentityServerServiceFactory()
                                .UseInMemoryUsers(Users.Get())
                                .UseInMemoryClients(Clients.Get())
                                .UseInMemoryScopes(Scopes.Get()),

                SigningCertificate = new X509Certificate2(certFile, ""),
                AuthenticationOptions = new AuthenticationOptions
                {
                    EnablePostSignOutAutoRedirect = true
                }
            };

            app.UseIdentityServer(idsrvOptions);
        }
    }
}