using AspNet5SQLite.Model;
using AspNet5SQLite.Repositories;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System.IO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.DataProtection;
using System.Security.Cryptography.X509Certificates;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System.Collections.Generic;
using Newtonsoft.Json.Serialization;

namespace AspNet5SQLite
{
    public class Startup
    {
        public IConfigurationRoot Configuration { get; set; }
        
        private IHostingEnvironment _env { get; set; }

        public Startup(IHostingEnvironment env)
        {
            _env = env;
            var builder = new ConfigurationBuilder()
                 .SetBasePath(env.ContentRootPath)
                .AddJsonFile("config.json");
            Configuration = builder.Build();
        }

        public void ConfigureServices(IServiceCollection services)
        {
            var connection = Configuration["Production:SqliteConnectionString"];
            var folderForKeyStore = Configuration["Production:KeyStoreFolderWhichIsBacked"];
          
            var cert = new X509Certificate2(Path.Combine(_env.ContentRootPath, "damienbodserver.pfx"), "");

            // Important The folderForKeyStore needs to be backed up.
            services.AddDataProtection()
                .SetApplicationName("AspNet5IdentityServerAngularImplicitFlow")
                .PersistKeysToFileSystem(new DirectoryInfo(folderForKeyStore))
                .ProtectKeysWithCertificate(cert);


            services.AddDbContext<DataEventRecordContext>(options =>
                options.UseSqlite(connection)
            );

            //Add Cors support to the service
            services.AddCors();

            var policy = new Microsoft.AspNetCore.Cors.Infrastructure.CorsPolicy();

            policy.Headers.Add("*");
            policy.Methods.Add("*");
            policy.Origins.Add("*");
            policy.SupportsCredentials = true;

            services.AddCors(x => x.AddPolicy("corsGlobalPolicy", policy));

            var guestPolicy = new AuthorizationPolicyBuilder()
                .RequireAuthenticatedUser()
                .RequireClaim("scope", "dataEventRecords")
                .Build();

            services.AddAuthorization(options =>
            {
                options.AddPolicy("dataEventRecordsAdmin", policyAdmin =>
                {
                    policyAdmin.RequireClaim("role", "dataEventRecords.admin");
                });
                options.AddPolicy("dataEventRecordsUser", policyUser =>
                {
                    policyUser.RequireClaim("role",  "dataEventRecords.user");
                });

            });

            services.AddMvc(options =>
            {
               options.Filters.Add(new AuthorizeFilter(guestPolicy));
            }).AddJsonOptions(options =>
            {
                options.SerializerSettings.ContractResolver = new DefaultContractResolver();
            });

            services.AddScoped<IDataEventRecordRepository, DataEventRecordRepository>();
        }

        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            loggerFactory.AddConsole();
            loggerFactory.AddDebug();

            app.UseExceptionHandler("/Home/Error");

            app.UseCors("corsGlobalPolicy");

            app.UseStaticFiles();

            //JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();
            //app.UseIdentityServerAuthentication(options =>
            //{
            //    options.Authority = "https://localhost:44318/";
            //    options.ScopeName = "dataEventRecords";
            //    options.ScopeSecret = "dataEventRecordsSecret";

            //    options.AutomaticAuthenticate = true;
            //    required if you want to return a 403 and not a 401 for forbidden responses

            //   options.AutomaticChallenge = true;
            //});

            JwtSecurityTokenHandler.DefaultInboundClaimTypeMap = new Dictionary<string, string>();

            var jwtBearerOptions = new JwtBearerOptions()
            {
                Authority = "https://localhost:44318",
                Audience = "https://localhost:44318/resources",
                AutomaticAuthenticate = true,

                // required if you want to return a 403 and not a 401 for forbidden responses
                AutomaticChallenge = true
            };

            app.UseJwtBearerAuthentication(jwtBearerOptions);

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");
            });
        }

        public static void Main(string[] args)
        {
            var host = new WebHostBuilder()
                .UseKestrel()
                .UseContentRoot(Directory.GetCurrentDirectory())
                .UseIISIntegration()
                .UseStartup<Startup>()
                .Build();

            host.Run();
        }
    }
}
