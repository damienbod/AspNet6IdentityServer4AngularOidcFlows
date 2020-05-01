using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System.IO;
using Microsoft.AspNetCore.Http;
using System.Linq;
using System;
using AngularClient.ViewModel;
using Microsoft.AspNetCore.Mvc;

namespace AngularClient
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            services.Configure<ClientAppSettings>(Configuration.GetSection("ClientAppSettings"));

            services.AddCors(options =>
            {
                options.AddPolicy("AllowAllOrigins",
                    builder =>
                    {
                        builder
                            .AllowCredentials()
                            .WithOrigins(
                                "https://localhost:44311",
                                "https://localhost:44352",
                                "https://localhost:44372",
                                "https://localhost:44378",
                                "https://localhost:44390")
                            .SetIsOriginAllowedToAllowWildcardSubdomains()
                            .AllowAnyHeader()
                            .AllowAnyMethod();
                    });
            });

            services.AddControllersWithViews().SetCompatibilityVersion(CompatibilityVersion.Version_3_0);
        }

        public void Configure(IApplicationBuilder app)
        {
            app.UseCors("AllowAllOrigins");

            var angularRoutes = new[] {
                "/home",
                "/forbidden",
                "/authorized",
                "/authorize",
                "/unauthorized",
                "/dataeventrecords",
                "/dataeventrecords/list",
                "/dataeventrecords/create",
                "/dataeventrecords/edit",
                "/logoff",
                "/securefiles",
            };

            app.Use(async (context, next) =>
            {
                if (context.Request.Path.HasValue && null != angularRoutes.FirstOrDefault(
                    (ar) => context.Request.Path.Value.StartsWith(ar, StringComparison.OrdinalIgnoreCase)))
                {
                    context.Request.Path = new PathString("/");
                }

                await next();
            });

            app.UseDefaultFiles();
            app.UseStaticFiles();

            app.UseRouting();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller=Home}/{action=Index}/{id?}");
            });
        }
    }
}
