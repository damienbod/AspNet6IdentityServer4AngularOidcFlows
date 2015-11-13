using System.Collections.Generic;
using IdentityServer3.Core.Models;

namespace IdentityServerAspNet5WithIdentity
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
                    DisplayName = "Data Event Records Scope",
                    Type = ScopeType.Resource,

                    Claims = new List<ScopeClaim>
                    {
                        new ScopeClaim("role")
                    }
                }
            };
        }
    }
}