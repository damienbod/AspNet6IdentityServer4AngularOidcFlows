using System.Collections.Generic;
using IdentityServer3.Core.Models;

namespace IdentityServerAspNet5
{
    public class Clients
    {
        public static List<Client> Get()
        {
            return new List<Client>
            {new Client
                {
                    ClientName = "AngularClient",
                    ClientId = "angular",
                    Flow = Flows.Implicit,
                    RedirectUris = new List<string>
                    {
                        "http://localhost:30661/",
                    },
                    PostLogoutRedirectUris = new List<string>
                    {
                        "http://localhost:30661/",
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