using System.Collections.Generic;
using IdentityServer3.Core.Models;

namespace IdentityServerAspNet5
{
    public class Clients
    {
        public static List<Client> Get()
        {
            return new List<Client>
            {
                new Client
                {
                    ClientName = "Test Client",
                    ClientId = "test",
                    ClientSecrets = new List<Secret>
                    {
                        new Secret("secret".Sha256())
                    },

                    // server to server communication
                    Flow = Flows.ClientCredentials,

                    // only allowed to access api1
                    AllowedScopes = new List<string>
                    {
                        "api1"
                    }
                },

                new Client
                {
                    ClientName = "MVC6 Demo Client",
                    ClientId = "mvc6",

                    // human involved
                    Flow = Flows.Implicit,

                    RedirectUris = new List<string>
                    {
                        "http://localhost:2221/",
                    },
                    PostLogoutRedirectUris = new List<string>
                    {
                        "http://localhost:2221/",
                    },

                    // access to identity data and api1
                    AllowedScopes = new List<string>
                    {
                        "openid",
                        "email",
                        "profile",
                        "api1"
                    }
                }
            };
        }
    }
}