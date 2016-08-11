using System.Collections.Generic;
using IdentityServer4.Models;

namespace Host.Configuration
{
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
                    AllowedGrantTypes = GrantTypes.Implicit,
                    AllowAccessTokensViaBrowser = true,
                    RedirectUris = new List<string>
                    {
                        "https://localhost:44347/authorized"
                    },
                    PostLogoutRedirectUris = new List<string>
                    {
                        "https://localhost:44347/unauthorized.html"
                    },
                    AllowedCorsOrigins = new List<string>
                    {
                        "https://localhost:44347"
                    },
                    AllowedScopes = new List<string>
                    {
                        "openid",
                        "email",
                        "profile",
                        "dataEventRecords",
                        "aReallyCoolScope",
                        "securedFiles",
                        "role"
                    }
                },
                new Client
                {
                    ClientName = "angular2client",
                    ClientId = "angular2client",
                    AllowedGrantTypes = GrantTypes.Implicit,
                    AllowAccessTokensViaBrowser = true,
                    RedirectUris = new List<string>
                    {
                        "https://localhost:44311"

                    },
                    PostLogoutRedirectUris = new List<string>
                    {
                        "https://localhost:44311/Unauthorized"
                    },
                    AllowedCorsOrigins = new List<string>
                    {
                        "https://localhost:44311",
                        "http://localhost:44311"
                    },                  
                    AllowedScopes = new List<string>
                    {
                        "openid",
                        "dataEventRecords",
                        "securedFiles",
                        "role"
                    }
                }
            };
        }
    }
}