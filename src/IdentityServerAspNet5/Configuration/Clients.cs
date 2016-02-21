namespace IdentityServerAspNet5.Configuration
{
    using System.Collections.Generic;

    using IdentityServer4.Core.Models;

    public class Clients
    {
        public static List<Client> Get()
        {
            return new List<Client>
            {
                new Client
                {
                    ClientName = "angularclient",
                    ClientId = "angularclient",
                    Flow = Flows.Implicit,
                    RedirectUris = new List<string>
                    {
                        "https://localhost:44347/authorized"

                    },
                    PostLogoutRedirectUris = new List<string>
                    {
                        "https://localhost:44347/unauthorized.html"
                    },
                    IncludeJwtId= true,
                    AllowedCorsOrigins = new List<string>
                    {
                        "https://localhost:44347",
                        "http://localhost:44347"
                    },
                    AllowedScopes = new List<string>
                    {
                        "openid",
                        "email",
                        "profile",
                        "dataEventRecords",
                        "aReallyCoolScope",
                        "role"
                    }
                },
                new Client
                {
                    ClientName = "angular2client",
                    ClientId = "angular2client",
                    Flow = Flows.Implicit,
                    RedirectUris = new List<string>
                    {
                        "https://localhost:44311/authorized"

                    },
                    PostLogoutRedirectUris = new List<string>
                    {
                        "https://localhost:44311/unauthorized.html"
                    },
                    IncludeJwtId= true,
                    AllowedCorsOrigins = new List<string>
                    {
                        "https://localhost:44311",
                        "http://localhost:44311"
                    },
                    AllowedScopes = new List<string>
                    {
                        "openid",
                        "email",
                        "profile",
                        "dataEventRecords",
                        "aReallyCoolScope",
                        "role"
                    }
                }
            };
        }
    }
}