namespace IdentityServerAspNet5.Configuration
{
    using System.Collections.Generic;
    using System.Security.Claims;

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
                        new Claim(Constants.ClaimTypes.Name, "damienbod"),
                        new Claim(Constants.ClaimTypes.GivenName, "damienbod"),
                        new Claim(Constants.ClaimTypes.Email, "damien_bod@hotmail.com"),
                        new Claim(Constants.ClaimTypes.EmailVerified, "true", ClaimValueTypes.Boolean),
                        new Claim(Constants.ClaimTypes.Role, "guest"),
                        new Claim(Constants.ClaimTypes.Role, "dataEventRecords")
                    }
                },
                new InMemoryUser{Subject = "48421157", Username = "damienbodadmin", Password = "damienbod",
                    Claims = new Claim[]
                    {
                        new Claim(Constants.ClaimTypes.Name, "damienbodadmin"),
                        new Claim(Constants.ClaimTypes.GivenName, "damienbodadmin"),
                        new Claim(Constants.ClaimTypes.Email, "damien_bod@hotmail.com"),
                        new Claim(Constants.ClaimTypes.EmailVerified, "true", ClaimValueTypes.Boolean),
                        new Claim(Constants.ClaimTypes.Role, "admin"),
                        new Claim(Constants.ClaimTypes.Role, "dataEventRecords.admin"),
                        new Claim(Constants.ClaimTypes.Role, "dataEventRecords.user"),
                        new Claim(Constants.ClaimTypes.Role, "dataEventRecords")
                    }
                },
                new InMemoryUser{Subject = "48421158", Username = "damienboduser", Password = "damienbod",
                    Claims = new Claim[]
                    {
                        new Claim(Constants.ClaimTypes.Name, "damienboduser"),
                        new Claim(Constants.ClaimTypes.GivenName, "damienboduser"),
                        new Claim(Constants.ClaimTypes.Email, "damien_bod@hotmail.com"),
                        new Claim(Constants.ClaimTypes.EmailVerified, "true", ClaimValueTypes.Boolean),
                        new Claim(Constants.ClaimTypes.Role, "user"),
                        new Claim(Constants.ClaimTypes.Role, "dataEventRecords.user"),
                        new Claim(Constants.ClaimTypes.Role, "dataEventRecords")
                    }
                }
            };

            return users;
        }
    }
}