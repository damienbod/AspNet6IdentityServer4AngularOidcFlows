using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.Builder;
using Microsoft.AspNet.Hosting;
using Microsoft.AspNet.Http;
using Microsoft.Extensions.DependencyInjection;

namespace Angular2Client
{
    public class Startup
    {
        public void ConfigureServices(IServiceCollection services)
        {
        }

        public void Configure(IApplicationBuilder app)
        {
            app.UseIISPlatformHandler();

            var angularRoutes = new[] {
                "/dataeventrecord",
                "/dataeventrecord/dataeventrecords",
                "/dataeventrecord/create",
                "/dataeventrecord/edit",
                "/forbidden",
                "/authorized",
                "/authorize",
                "/unauthorized",
                "/logoff",
                "/secureFiles",
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

            app.Run(async (context) =>
            {
                await context.Response.WriteAsync("This is server routing, not angular2 routing");
            });
        }

        public static void Main(string[] args) => WebApplication.Run<Startup>(args);
    }
}
