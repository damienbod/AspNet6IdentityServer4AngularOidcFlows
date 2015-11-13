using System.Collections.Generic;
using IdentityServer3.Core.Models;

namespace IdentityServerAspNet5WithIdentity
{
    public class Clients
    {
        public static List<Client> Get()
        {
            return new List<Client>
            {new Client
                {
                    ClientName = "angularclient",
                    ClientId = "angularclient",
                    Flow = Flows.Implicit,
                    RedirectUris = new List<string>
                    {
                        "https://localhost:44302/identitytestclient.html",
                        "https://localhost:44302/authorized"

                    },
                    PostLogoutRedirectUris = new List<string>
                    {
                        "https://localhost:44302/identitytestclient.html",
                        "https://localhost:44302/authorized"
                    },
                    AllowedScopes = new List<string>
                    {
                        "openid",
                        "email",
                        "profile",
                        "dataEventRecords"
                    }
                },
                new Client
                {
                    ClientName = "MVC6 Demo Client from Identity",
                    ClientId = "mvc6",
                    Flow = Flows.Implicit,
                    RedirectUris = new List<string>
                    {
                        "http://localhost:2221/",
                    },
                    PostLogoutRedirectUris = new List<string>
                    {
                        "http://localhost:2221/",
                    },
                    AllowedScopes = new List<string>
                    {
                        "openid",
                        "email",
                        "profile",
                        "dataEventRecords"
                    }
                }
            };
        }
    }
}