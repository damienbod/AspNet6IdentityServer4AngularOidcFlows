using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.IO;
using Microsoft.AspNetCore.Mvc.Authorization;
using ResourceFileServer.Providers;
using IdentityServer4.AccessTokenValidation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

namespace ResourceFileServer
{
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

            //services.AddAuthentication((options) =>
            //{
            //    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            //    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            //})
            //.AddJwtBearer(options =>
            //{
            //    options.TokenValidationParameters = new TokenValidationParameters
            //    {
            //        ValidateIssuer = true, 
            //        ValidateAudience = true,
            //        ValidateLifetime = true,
            //        ValidateIssuerSigningKey = true,

            //        ValidIssuer = "Fiver.Security.Bearer",
            //        ValidAudience = "Fiver.Security.Bearer",
            //        IssuerSigningKey = JwtSecurityKey.Create("fiversecret ")
            //    }; ;
            //    options.Authority = "https://localhost:44318/";
            //    options. = new List<string> { "securedFiles" };
            //    options.ApiName = "securedFiles";
            //    options.ApiSecret = "securedFilesSecret";
            //});

            services.AddAuthentication(IdentityServerAuthenticationDefaults.AuthenticationScheme)
               .AddIdentityServerAuthentication(options =>
               {
                   options.Authority = "https://localhost:44318/";
                   options.AllowedScopes = new List<string> { "securedFiles" };
                   options.ApiName = "securedFiles";
                   options.ApiSecret = "securedFilesSecret";
               });

            //IdentityServerAuthenticationOptions identityServerAuthenticationOptions = new IdentityServerAuthenticationOptions()
            //{
            //    Authority = "https://localhost:44318/",
            //    AllowedScopes = new List<string> { "securedFiles" },
            //    ApiSecret = "securedFilesSecret",
            //    ApiName = "securedFiles",
            //    AutomaticAuthenticate = true,
            //    // required if you want to return a 403 and not a 401 for forbidden responses
            //    AutomaticChallenge = true
            //};
            //JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();
            //app.UseIdentityServerAuthentication(identityServerAuthenticationOptions);


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

            app.UseAuthentication();
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
