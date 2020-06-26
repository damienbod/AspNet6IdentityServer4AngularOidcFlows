using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Mvc.Authorization;
using ResourceFileServer.Providers;
using IdentityServer4.AccessTokenValidation;
using Microsoft.AspNetCore.Mvc;

namespace ResourceFileServer
{
    public class Startup
    {
        public Startup(IConfiguration configuration, IWebHostEnvironment webHostEnvironment)
        {
            Configuration = configuration;
            _webHostEnvironment = webHostEnvironment;
        }

        public IConfiguration Configuration { get; }
        private readonly IWebHostEnvironment _webHostEnvironment;

        public void ConfigureServices(IServiceCollection services)
        {
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

            var securedFilesPolicy = new AuthorizationPolicyBuilder()
                .RequireAuthenticatedUser()
                .RequireClaim("scope", "securedFiles")
                .Build();

            services.AddAuthentication(IdentityServerAuthenticationDefaults.AuthenticationScheme)
               .AddIdentityServerAuthentication(options =>
               {
                   options.Authority = "https://localhost:44318/";
                   options.ApiName = "securedFilesApi";
                   options.ApiSecret = "securedFilesSecret";
               });

            services.AddAuthorization(options =>
            {
                options.AddPolicy("securedFilesUser", policyUser =>
                {
                    policyUser.RequireClaim("role", "securedFiles.user");
                });
                options.AddPolicy("securedFiles", policyUser =>
                {
                    policyUser.RequireClaim("scope", "securedFiles");
                });
            });

            services.AddControllers(
                options =>
                {
                    options.Filters.Add(new AuthorizeFilter(securedFilesPolicy));
                })
                .AddNewtonsoftJson();

            services.AddTransient<ISecuredFileProvider, SecuredFileProvider>();
            services.AddSingleton<UseOnceAccessIdService>();
        }

        public void Configure(IApplicationBuilder app)
        {
            app.UseExceptionHandler("/Home/Error");
            app.UseCors("AllowAllOrigins");
            app.UseStaticFiles();

            app.UseRouting();
			
            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
