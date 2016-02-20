namespace IdentityServerAspNet5.Configuration
{
    using System.Collections.Generic;

    using IdentityServer4.Core.Models;

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
                    DisplayName = "Data Event Records Scope",
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
                }
            };
        }
    }
}