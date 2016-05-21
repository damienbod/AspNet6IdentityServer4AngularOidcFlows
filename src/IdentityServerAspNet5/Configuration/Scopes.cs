using System.Collections.Generic;
using IdentityServer4.Core.Models;

namespace Host.Configuration
{
    public class Scopes
    {
        public static IEnumerable<Scope> Get()
        {
            return new[]
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
    }
}