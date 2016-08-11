using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace ResourceFileServer
{
    using System.IdentityModel.Tokens.Jwt;
    using System.IO;
    using Microsoft.AspNetCore.Mvc.Authorization;
    using Providers;
    public class Startup
    {
        public Startup(IHostingEnvironment env)
        {
            var builder = new ConfigurationBuilder()
                 .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json");
            Configuration = builder.Build();
        }

        public IConfigurationRoot Configuration { get; set; }

        public void ConfigureServices(IServiceCollection services)
        {
            //Add Cors support to the service
            services.AddCors();

            var policy = new Microsoft.AspNetCore.Cors.Infrastructure.CorsPolicy();

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

            app.UseCors("corsGlobalPolicy");

            app.UseStaticFiles();

            IdentityServerAuthenticationOptions identityServerAuthenticationOptions = new IdentityServerAuthenticationOptions();
            identityServerAuthenticationOptions.Authority = "https://localhost:44345/";
            identityServerAuthenticationOptions.ScopeName = "securedFiles";
            identityServerAuthenticationOptions.ScopeSecret = "securedFilesSecret";

            identityServerAuthenticationOptions.AutomaticAuthenticate = true;
            // required if you want to return a 403 and not a 401 for forbidden responses
            identityServerAuthenticationOptions.AutomaticChallenge = true;

            JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();
            app.UseIdentityServerAuthentication(identityServerAuthenticationOptions);

            app.UseMvc();
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
