using Microsoft.AspNet.Builder;
using System.Security.Cryptography.X509Certificates;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.PlatformAbstractions;
using Microsoft.AspNet.Hosting;

namespace IdentityServerAspNet5
{
    using System.IO;

    using IdentityServer4.Core.Configuration;

    using IdentityServerAspNet5.Configuration;
    using IdentityServerAspNet5.UI;
    using IdentityServerAspNet5.UI.Login;

    using Microsoft.Extensions.Logging;

    public class Startup
    {
        private readonly IApplicationEnvironment _environment;

        public Startup(IApplicationEnvironment environment)
        {
            _environment = environment;
        }

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

            var cert = new X509Certificate2(Path.Combine(_environment.ApplicationBasePath, "damienbodserver.pfx"), "");

            var builder = services.AddIdentityServer(options =>
            {
                options.SigningCertificate = cert;
                options.Endpoints.EnableEndSessionEndpoint = true;

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

        public void Configure(IApplicationBuilder app, ILoggerFactory loggerFactory)
        {
            app.UseCors("corsGlobalPolicy");

            loggerFactory.AddConsole(LogLevel.Verbose);
            loggerFactory.AddDebug(LogLevel.Verbose);

            app.UseDeveloperExceptionPage();
            app.UseIISPlatformHandler();

            app.UseIdentityServer();

            app.UseStaticFiles();
            app.UseMvcWithDefaultRoute();
        }
       
        public static void Main(string[] args) => WebApplication.Run<Startup>(args);
    }
}