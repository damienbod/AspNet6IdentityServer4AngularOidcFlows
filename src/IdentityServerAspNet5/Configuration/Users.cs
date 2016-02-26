namespace IdentityServerAspNet5.Configuration
{
    using System.Collections.Generic;
    using System.Security.Claims;
    using IdentityModel;
    using IdentityServer4.Core;
    using IdentityServer4.Core.Services.InMemory;

    static class Users
    {
        public static List<InMemoryUser> Get()
        {
            var users = new List<InMemoryUser>
            {
                new InMemoryUser{Subject = "48421156", Username = "damienbod", Password = "damienbod",
                    Claims = new Claim[]
                    {
                        new Claim(JwtClaimTypes.Name, "damienbod"),
                        new Claim(JwtClaimTypes.GivenName, "damienbod"),
                        new Claim(JwtClaimTypes.Email, "damien_bod@hotmail.com"),
                        new Claim(JwtClaimTypes.EmailVerified, "true", ClaimValueTypes.Boolean),
                        new Claim(JwtClaimTypes.Role, "guest"),
                        new Claim(JwtClaimTypes.Role, "dataEventRecords")
                    }
                },
                new InMemoryUser{Subject = "48421157", Username = "damienbodadmin", Password = "damienbod",
                    Claims = new Claim[]
                    {
                        new Claim(JwtClaimTypes.Name, "damienbodadmin"),
                        new Claim(JwtClaimTypes.GivenName, "damienbodadmin"),
                        new Claim(JwtClaimTypes.Email, "damien_bod@hotmail.com"),
                        new Claim(JwtClaimTypes.EmailVerified, "true", ClaimValueTypes.Boolean),
                        new Claim(JwtClaimTypes.Role, "admin"),
                        new Claim(JwtClaimTypes.Role, "dataEventRecords.admin"),
                        new Claim(JwtClaimTypes.Role, "dataEventRecords.user"),
                        new Claim(JwtClaimTypes.Role, "dataEventRecords")
                    }
                },
                new InMemoryUser{Subject = "48421158", Username = "damienboduser", Password = "damienbod",
                    Claims = new Claim[]
                    {
                        new Claim(JwtClaimTypes.Name, "damienboduser"),
                        new Claim(JwtClaimTypes.GivenName, "damienboduser"),
                        new Claim(JwtClaimTypes.Email, "damien_bod@hotmail.com"),
                        new Claim(JwtClaimTypes.EmailVerified, "true", ClaimValueTypes.Boolean),
                        new Claim(JwtClaimTypes.Role, "user"),
                        new Claim(JwtClaimTypes.Role, "dataEventRecords.user"),
                        new Claim(JwtClaimTypes.Role, "dataEventRecords")
                    }
                }
            };

            return users;
        }
    }
}