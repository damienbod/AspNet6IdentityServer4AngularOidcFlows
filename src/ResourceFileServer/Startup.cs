using Microsoft.AspNet.Authorization;
using Microsoft.AspNet.Builder;
using Microsoft.AspNet.Hosting;
using Microsoft.AspNet.Mvc.Filters;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace ResourceFileServer
{
    using System.IdentityModel.Tokens.Jwt;
    using Providers;
    public class Startup
    {
        public Startup(IHostingEnvironment env)
        {
            var builder = new ConfigurationBuilder()
                .AddJsonFile("appsettings.json")
                .AddEnvironmentVariables();
            Configuration = builder.Build();
        }

        public IConfigurationRoot Configuration { get; set; }

        public void ConfigureServices(IServiceCollection services)
        {
            //Add Cors support to the service
            services.AddCors();

            var policy = new Microsoft.AspNet.Cors.Infrastructure.CorsPolicy();

            policy.Headers.Add("*");
            policy.Methods.Add("*");
            policy.Origins.Add("*");
            policy.SupportsCredentials = true;

            services.AddCors(x => x.AddPolicy("corsGlobalPolicy", policy));

            var securedFilesPolicy = new AuthorizationPolicyBuilder()
                .RequireAuthenticatedUser()
                .RequireClaim("scope", "securedFiles")
                .Build();

            services.AddAuthorization(options =>
            {
                options.AddPolicy("securedFilesUser", policyUser =>
                {
                    policyUser.RequireClaim("role", "securedFiles.user");
                });
            });

            services.AddMvc(options =>
            {
                options.Filters.Add(new AuthorizeFilter(securedFilesPolicy));
            });

            services.AddMvc();

            services.AddTransient<ISecuredFileProvider, SecuredFileProvider>();
            services.AddSingleton<UseOnceAccessIdService>();
        }

        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            loggerFactory.AddConsole(Configuration.GetSection("Logging"));
            loggerFactory.AddDebug();

            app.UseIISPlatformHandler();

            app.UseCors("corsGlobalPolicy");

            app.UseStaticFiles();

            JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();
            app.UseIdentityServerAuthentication(options =>
            {
                options.Authority = "https://localhost:44345/";
                options.ScopeName = "securedFiles";
                options.ScopeSecret = "securedFilesSecret";

                options.AutomaticAuthenticate = true;
                // required if you want to return a 403 and not a 401 for forbidden responses
                options.AutomaticChallenge = true;
            });

            app.UseMvc();
        }

        public static void Main(string[] args) => WebApplication.Run<Startup>(args);
    }
}
