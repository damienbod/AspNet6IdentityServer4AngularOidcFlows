using IdentityServer4.Models;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;

namespace StsServerIdentity
{
    public class Config
    {
        public static IEnumerable<IdentityResource> GetIdentityResources()
        {
            return new List<IdentityResource>
            {
                new IdentityResources.OpenId(),
                new IdentityResources.Profile(),
                new IdentityResources.Email(), 
                new IdentityResource("dataeventrecordsir",new []{ "role", "admin", "user", "dataEventRecords", "dataEventRecords.admin" , "dataEventRecords.user" } ),
                new IdentityResource("securedfilessir",new []{ "role", "admin", "user", "securedFiles", "securedFiles.admin", "securedFiles.user"} )
            };
        }

        public static IEnumerable<ApiScope> GetApiScopes()
        {
            return new List<ApiScope>
            {
                new ApiScope("dataEventRecords", "Scope for the dataEventRecords ApiResource",
                    new List<string> { "role", "admin", "user", "dataEventRecords", "dataEventRecords.admin", "dataEventRecords.user"}),
                new ApiScope("securedFiles",  "Scope for the securedFiles ApiResource",
                    new List<string> { "role", "admin", "user", "securedFiles", "securedFiles.admin", "securedFiles.user" })
            };
        }

        public static IEnumerable<ApiResource> GetApiResources()
        {
            return new List<ApiResource>
            {
                new ApiResource("dataEventRecordsApi")
                {
                    ApiSecrets =
                    {
                        new Secret("dataEventRecordsSecret".Sha256())
                    }, 
                    Scopes = new List<string> { "dataEventRecords" }
                },
                new ApiResource("securedFilesApi")
                {
                    ApiSecrets =
                    {
                        new Secret("securedFilesSecret".Sha256())
                    },
                    Scopes = new List<string> { "securedFiles" }
                }
            };
        }

        // clients want to access resources (aka scopes)
        public static IEnumerable<Client> GetClients(IConfigurationSection stsConfig)
        {
            var angularClientIdTokenOnlyUrl = stsConfig["AngularClientIdTokenOnlyUrl"];
            var angularClientUrl = stsConfig["AngularClientUrl"];
            // TODO use configs in app

            // client credentials client
            return new List<Client>
            {
                new Client
                {
                    ClientName = "angularImplicitFlowclient",
                    ClientId = "angularImplicitFlowclient",
                    AccessTokenType = AccessTokenType.Reference,
                    RequireConsent = true,
                    AccessTokenLifetime = 330,// 330 seconds, default 60 minutes
                    IdentityTokenLifetime = 30,
                    AllowedGrantTypes = GrantTypes.Implicit,
                    AllowAccessTokensViaBrowser = true,
                    RedirectUris = new List<string>
                    {
                        "https://localhost:44311",
                        "https://localhost:44311/silent-renew.html"

                    },
                    PostLogoutRedirectUris = new List<string>
                    {
                        "https://localhost:44311/unauthorized",
                        "https://localhost:44311"
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
                        "dataeventrecordsir",
                        "securedFiles",
                        "securedfilesir",
                        "role",
                        "profile",
                        "email"
                    }
                },
                new Client
                {
                    ClientName = "angularclientidtokenonly",
                    ClientId = "angularclientidtokenonly",
                    AccessTokenType = AccessTokenType.Reference,
                    AccessTokenLifetime = 360,// 120 seconds, default 60 minutes
                    IdentityTokenLifetime = 30,
                    AllowedGrantTypes = GrantTypes.Implicit,
                    AlwaysIncludeUserClaimsInIdToken = true,
                    AllowAccessTokensViaBrowser = true,
                    RedirectUris = new List<string>
                    {
                        "https://localhost:44372",
                        "https://localhost:44372/silent-renew.html"

                    },
                    PostLogoutRedirectUris = new List<string>
                    {
                        "https://localhost:44372/Unauthorized"
                    },
                    AllowedCorsOrigins = new List<string>
                    {
                        "https://localhost:44372",
                        "http://localhost:44372"
                    },
                    AllowedScopes = new List<string>
                    {
                        "openid",
                        "dataEventRecords",
                        "dataeventrecordsir",
                        "securedFiles",
                        "securedfilesir",
                        "role",
                        "profile",
                        "email"
                    }
                },
                new Client
                {
                    ClientName = "angular_code_client",
                    ClientId = "angular_code_client",
                    AccessTokenType = AccessTokenType.Reference,
                    AccessTokenLifetime = 330,// 330 seconds, default 60 minutes
                    IdentityTokenLifetime = 30,

                    RequireClientSecret = false,
                    AllowedGrantTypes = GrantTypes.Code,
                    RequirePkce = true,

                    AllowAccessTokensViaBrowser = true,
                    RedirectUris = new List<string>
                    {
                        "https://localhost:44352",
                        "https://localhost:44352/silent-renew.html",
                        "https://localhost:4200",
                        "https://localhost:4200/silent-renew.html"
                    },
                    PostLogoutRedirectUris = new List<string>
                    {
                        "https://localhost:44352/unauthorized",
                        "https://localhost:44352",
                        "https://localhost:4200/unauthorized",
                        "https://localhost:4200"
                    },
                    AllowedCorsOrigins = new List<string>
                    {
                        "https://localhost:44352",
                        "https://localhost:4200"
                    },
                    AllowedScopes = new List<string>
                    {
                        "openid",
                        "dataEventRecords",
                        "dataeventrecordsir",
                        "securedFiles",
                        "securedfilesir",
                        "role",
                        "profile",
                        "email"
                    }
                },
                new Client
                {
                    ClientName = "angularjsclient",
                    ClientId = "angularjsclient",
                    AllowedGrantTypes = GrantTypes.Implicit,
                    AllowAccessTokensViaBrowser = true,
                    RedirectUris = new List<string>
                    {
                        "https://localhost:44376/authorized"
                    },
                    PostLogoutRedirectUris = new List<string>
                    {
                        "https://localhost:44346/unauthorized.html"
                    },
                    AllowedCorsOrigins = new List<string>
                    {
                        "https://localhost:44346"
                    },
                    AllowedScopes = new List<string>
                    {
                        "openid",
                        "email",
                        "profile",
                        "dataEventRecords",
                        "dataeventrecordsir",
                        "securedFiles",
                        "securedfilesir",
                    }
                },
            };
        }
    }
}