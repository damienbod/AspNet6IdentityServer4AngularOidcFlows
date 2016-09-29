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
                    ClientName = "singleapp",
                    ClientId = "singleapp",
                    AccessTokenType = AccessTokenType.Reference,
                    //AccessTokenLifetime = 600, // 10 minutes, default 60 minutes
                    AllowedGrantTypes = GrantTypes.Implicit,
                    AllowAccessTokensViaBrowser = true,
                    RedirectUris = new List<string>
                    {
                        "https://localhost:44363"

                    },
                    PostLogoutRedirectUris = new List<string>
                    {
                        "https://localhost:44363/Unauthorized"
                    },
                    AllowedCorsOrigins = new List<string>
                    {
                        "https://localhost:44363",
                        "http://localhost:44363"
                    },
                    AllowedScopes = new List<string>
                    {
                        "openid",
                        "dataEventRecords"
                    }
                }
            };
        }
    }
}