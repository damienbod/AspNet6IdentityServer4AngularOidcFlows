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
                    DisplayName = "Guest Data Event Records Scope",
                    Type = ScopeType.Resource,

                    Claims = new List<ScopeClaim>
                    {
                        new ScopeClaim("dataEventRecords")
                    }
                },
                new Scope
                {
                    Name = "dataEventRecords.admin",
                    DisplayName = "Admin Data Event Records Scope",
                    Type = ScopeType.Resource,

                    Claims = new List<ScopeClaim>
                    {
                        new ScopeClaim("dataEventRecords.admin")
                    }
                },
                new Scope
                {
                    Name = "dataEventRecords.user",
                    DisplayName = "User Data Event Records Scope",
                    Type = ScopeType.Resource,

                    Claims = new List<ScopeClaim>
                    {
                        new ScopeClaim("dataEventRecords.user")
                    }
                    
                }
            };
        }
    }
}