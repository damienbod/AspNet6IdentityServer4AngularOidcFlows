using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using ResourceWithIdentityServerWithClient.Data;
using ResourceWithIdentityServerWithClient.Models;
using QuickstartIdentityServer;
using IdentityServer4.Services;
using System.Security.Cryptography.X509Certificates;
using System.IO;
using Microsoft.AspNetCore.Http;
using System.Linq;
using System;
using IdentityServer4.AccessTokenValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using ResourceWithIdentityServerWithClient.Services.Certificate;
using ResourceWithIdentityServerWithClient.Services;
using Microsoft.Extensions.Hosting;

namespace ResourceWithIdentityServerWithClient
{
    public class Startup
    {
        public Startup(IConfiguration configuration, IWebHostEnvironment env)
        {
            Configuration = configuration;
            _environment = env;
        }
        public IConfiguration Configuration { get; }
        public IWebHostEnvironment _environment { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            var useLocalCertStore = Convert.ToBoolean(Configuration["UseLocalCertStore"]);
            var certificateThumbprint = Configuration["CertificateThumbprint"];

            X509Certificate2 cert;

            if (_environment.IsProduction())
            {
                if (useLocalCertStore)
                {
                    using (X509Store store = new X509Store(StoreName.My, StoreLocation.LocalMachine))
                    {
                        store.Open(OpenFlags.ReadOnly);
                        var certs = store.Certificates.Find(X509FindType.FindByThumbprint, certificateThumbprint, false);
                        cert = certs[0];
                        store.Close();
                    }
                }
                else
                {
                    // Azure deployment, will be used if deployed to Azure
                    var vaultConfigSection = Configuration.GetSection("Vault");
                    var keyVaultService = new KeyVaultCertificateService(vaultConfigSection["Url"], vaultConfigSection["ClientId"], vaultConfigSection["ClientSecret"]);
                    cert = keyVaultService.GetCertificateFromKeyVault(vaultConfigSection["CertificateName"]);
                }
            }
            else
            {
                cert = new X509Certificate2(Path.Combine(_environment.ContentRootPath, "damienbodserver.pfx"), "");
            }

            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlite(Configuration.GetConnectionString("DefaultConnection")));

            services.Configure<EmailSettings>(Configuration.GetSection("EmailSettings"));

            services.AddIdentity<ApplicationUser, IdentityRole>()
            .AddEntityFrameworkStores<ApplicationDbContext>();

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

            var guestPolicy = new AuthorizationPolicyBuilder()
           .RequireAuthenticatedUser()
           .RequireClaim("scope", "dataEventRecords")
           .Build();

            services.AddTransient<IProfileService, IdentityWithAdditionalClaimsProfileService>();

            services.AddIdentityServer()
                .AddSigningCredential(cert)
                .AddInMemoryIdentityResources(Config.GetIdentityResources())
                .AddInMemoryApiResources(Config.GetApiResources())
                .AddInMemoryClients(Config.GetClients())
                .AddAspNetIdentity<ApplicationUser>()
                .AddProfileService<IdentityWithAdditionalClaimsProfileService>();

            services.AddAuthentication(IdentityServerAuthenticationDefaults.AuthenticationScheme)
              .AddIdentityServerAuthentication(options =>
              {
                  options.Authority = Config.HOST_URL + "/";
                  options.ApiName = "dataEventRecords";
                  options.ApiSecret = "dataEventRecordsSecret";
                  options.SupportedTokens = SupportedTokens.Both;
              });

            services.AddTransient<IEmailSender, EmailSender>();

            services.AddAuthorization(options =>
            {
                options.AddPolicy("dataEventRecordsAdmin", policyAdmin =>
                {
                    policyAdmin.RequireClaim("role", "dataEventRecords.admin");
                });
                options.AddPolicy("admin", policyAdmin =>
                {
                    policyAdmin.RequireClaim("role", "admin");
                });
                options.AddPolicy("dataEventRecordsUser", policyUser =>
                {
                    policyUser.RequireClaim("role", "dataEventRecords.user");
                });
                options.AddPolicy("dataEventRecords", policyUser =>
                {
                    policyUser.RequireClaim("scope", "dataEventRecords");
                });
            });

            services.AddControllers()
                .AddNewtonsoftJson()
                .SetCompatibilityVersion(CompatibilityVersion.Version_3_0);
            services.AddControllersWithViews()
                .SetCompatibilityVersion(CompatibilityVersion.Version_3_0)
               .AddViewLocalization();
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            //JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();
            app.UseCors("AllowAllOrigins");

            var angularRoutes = new[] {
                "/Unauthorized",
                "/Forbidden",
                "/uihome",
                "/dataeventrecords",
                "/dataeventrecords/",
                "/dataeventrecords/create",
                "/dataeventrecords/edit/",
                "/dataeventrecords/list",
                "/usermanagement",
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
            app.UseIdentityServer();
            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller=Home}/{action=Index}/{id?}");
            });
        }
    }
}
