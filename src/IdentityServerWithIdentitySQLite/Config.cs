// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

using IdentityServer4.Models;
using System.Collections.Generic;

namespace QuickstartIdentityServer
{
    public class Config
    {
        // scopes define the resources in your system
        public static IEnumerable<Scope> GetScopes()
        {
            return new List<Scope>
            {
                 // standard OpenID Connect scopes
                StandardScopes.OpenId,
                StandardScopes.ProfileAlwaysInclude,
                StandardScopes.EmailAlwaysInclude,
           
                // API - access token will 
                // contain roles of user
                new Scope
                {
                    Name = "dataEventRecords",
                    DisplayName = "Scope for the data event records resource.",
                    Type = ScopeType.Resource,
                    ScopeSecrets = new List<Secret>
                    {
                        new Secret("dataEventRecordsSecret".Sha256())
                    },
                    Claims = new List<ScopeClaim>
                    {
                        new ScopeClaim("role"),
                        new ScopeClaim("dataEventRecords")
                    }
                },
                new Scope
                {
                    Name = "aReallyCoolScope",
                    DisplayName = "A really cool scope",
                    Type = ScopeType.Resource,

                    Claims = new List<ScopeClaim>
                    {
                        new ScopeClaim("role"),
                        new ScopeClaim("aReallyCoolScope")
                    }
                },
                new Scope
                {
                    Name = "securedFiles",
                    DisplayName = "Scope for the secured files resource.",
                    Type = ScopeType.Resource,

                    ScopeSecrets = new List<Secret>
                    {
                        new Secret("securedFilesSecret".Sha256())
                    },
                    Claims = new List<ScopeClaim>
                    {
                        new ScopeClaim("role"),
                        new ScopeClaim("securedFiles")
                    }
                }
            };
        }

        // clients want to access resources (aka scopes)
        public static IEnumerable<Client> GetClients()
        {
            // client credentials client
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
                        "securedFiles"
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
                        "securedFiles"
                    }
                },
                new Client
                {
                    ClientName = "angular2hydrid",
                    ClientId = "angular2hydrid",
                    AllowedGrantTypes = GrantTypes.Hybrid,
                    AllowAccessTokensViaBrowser = true,
                    RedirectUris = new List<string>
                    {
                        "https://localhost:44369"

                    },
                    PostLogoutRedirectUris = new List<string>
                    {
                        "https://localhost:44311/Unauthorized"
                    },
                    AllowedCorsOrigins = new List<string>
                    {
                        "https://localhost:44369",
                        "http://localhost:44369"
                    },
                    AllowedScopes = new List<string>
                    {
                        "openid",
                        "dataEventRecords",
                        "securedFiles"
                    }
                }
            };
        }
    }
}