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
            var cert = new X509Certificate2(Path.Combine(_environment.ApplicationBasePath, "damienbodserver.pfx"), "");

            var builder = services.AddIdentityServer(options =>
            {
                options.SigningCertificate = cert;
            });

            builder.AddInMemoryClients(Clients.Get());
            builder.AddInMemoryScopes(Scopes.Get());
            builder.AddInMemoryUsers(Users.Get());

            //builder.AddCustomGrantValidator<CustomGrantValidator>();

            // for the UI
            services
                .AddMvc()
                .AddRazorOptions(razor =>
                {
                    razor.ViewLocationExpanders.Add(new IdSvrHost.UI.CustomViewLocationExpander());
                });
            services.AddTransient<LoginService>();
        }

        public void Configure(IApplicationBuilder app, ILoggerFactory loggerFactory)
        {
            loggerFactory.AddConsole(LogLevel.Verbose);
            loggerFactory.AddDebug(LogLevel.Verbose);

            app.UseDeveloperExceptionPage();
            app.UseIISPlatformHandler();

            app.UseIdentityServer();

            app.UseStaticFiles();
            app.UseMvcWithDefaultRoute();
        }
        //public void ConfigureServices(IServiceCollection services)
        //{
        //    services.AddDataProtection();
        //}

        //public void Configure(IApplicationBuilder app, IApplicationEnvironment env)
        //{
        //    app.UseIISPlatformHandler();
        //    app.UseDeveloperExceptionPage();

        //    var certFile = env.ApplicationBasePath + "\\damienbodserver.pfx";

        //    var idsrvOptions = new IdentityServerOptions
        //    {
        //        Factory = new IdentityServerServiceFactory()
        //                        .UseInMemoryUsers(Users.Get())
        //                        .UseInMemoryClients(Clients.Get())
        //                        .UseInMemoryScopes(Scopes.Get()),

        //        SigningCertificate = new X509Certificate2(certFile, ""),
        //        AuthenticationOptions = new AuthenticationOptions
        //        {
        //            EnablePostSignOutAutoRedirect = true
        //        }
        //    };

        //    app.UseIdentityServer(idsrvOptions);
        //}

        // Entry point for the application.
        public static void Main(string[] args) => WebApplication.Run<Startup>(args);
    }
}