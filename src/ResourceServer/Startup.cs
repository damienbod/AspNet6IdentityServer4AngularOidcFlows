using AspNet5SQLite.Model;
using AspNet5SQLite.Repositories;
using Microsoft.AspNet.Builder;
using Microsoft.AspNet.Hosting;
using Microsoft.Data.Entity;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;

using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.PlatformAbstractions;
using Microsoft.AspNet.Authorization;
using Microsoft.AspNet.Mvc.Filters;
using System;
using System.IO;

namespace AspNet5SQLite
{
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

            services.AddDataProtection();
            services.ConfigureDataProtection(configure =>
            {
                configure.SetApplicationName("AspNet5IdentityServerAngularImplicitFlow");
                configure.DisableAutomaticKeyGeneration();

                // This folder needs to be backed up.
                configure.PersistKeysToFileSystem(new DirectoryInfo(@"C:\\git\\damienbod\\AspNet5IdentityServerAngularImplicitFlow\\src\\ResourceServer\\Keys"));
            });

            services.AddEntityFramework()
                .AddSqlite()
                .AddDbContext<DataEventRecordContext>(options => options.UseSqlite(connection));

            //Add Cors support to the service
            services.AddCors();

            var policy = new Microsoft.AspNet.Cors.Infrastructure.CorsPolicy();

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
            });

            services.AddScoped<IDataEventRecordRepository, DataEventRecordRepository>();
        }

        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            loggerFactory.MinimumLevel = LogLevel.Information;
            loggerFactory.AddConsole();
            loggerFactory.AddDebug();

            app.UseIISPlatformHandler();

            app.UseExceptionHandler("/Home/Error");

            app.UseCors("corsGlobalPolicy");

            app.UseStaticFiles();

            JwtSecurityTokenHandler.DefaultInboundClaimTypeMap = new Dictionary<string, string>();

            app.UseJwtBearerAuthentication(options =>
            {
                options.Authority = "https://localhost:44345";
                options.Audience = "https://localhost:44345/resources";
                options.AutomaticAuthenticate = true;

                // required if you want to return a 403 and not a 401 for forbidden responses
                options.AutomaticChallenge = true;
            });

            //app.UseMiddleware<RequiredScopesMiddleware>(new List<string> { "dataEventRecords", "aReallyCoolScope" });
            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");
            });
        }

        // Entry point for the application.
        public static void Main(string[] args) => WebApplication.Run<Startup>(args);
    }
}
