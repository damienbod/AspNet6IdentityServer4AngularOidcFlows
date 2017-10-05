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
using IdentityServer4.AccessTokenValidation;

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

            services.AddAuthentication(IdentityServerAuthenticationDefaults.AuthenticationScheme)
              .AddIdentityServerAuthentication(options =>
              {
                  options.Authority = "https://localhost:44318/";
                  options.ApiName = "dataEventRecords";
                  options.ApiSecret = "dataEventRecordsSecret";
              });

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
                options.AddPolicy("dataEventRecords", policyUser =>
                {
                    policyUser.RequireClaim("scope", "dataEventRecords");
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

            app.UseAuthentication();
            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");
            });
        }
    }
}
