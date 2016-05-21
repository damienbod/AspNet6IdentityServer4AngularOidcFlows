using IdentityServer4.Core.Services.InMemory;
using System.Linq;
using System.Collections.Generic;
using System;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using IdentityModel;

namespace Host.UI.Login
{
    public class LoginService
    {
        private readonly List<InMemoryUser> _users;

        public LoginService(List<InMemoryUser> users)
        {
            _users = users;
        }

        public bool ValidateCredentials(string username, string password)
        {
            var user = FindByUsername(username);
            if (user != null)
            {
                return user.Password.Equals(password);
            }
            return false;
        }

        public InMemoryUser FindByUsername(string username)
        {
            return _users.FirstOrDefault(x=>x.Username.Equals(username, System.StringComparison.OrdinalIgnoreCase));
        }

        public InMemoryUser FindByExternalProvider(string provider, string userId)
        {
            return _users.FirstOrDefault(x => 
                x.Provider == provider &&
                x.ProviderId == userId);
        }

        public InMemoryUser AutoProvisionUser(string provider, string userId, List<Claim> claims)
        {
            var filtered = new List<Claim>();
            foreach(var claim in claims)
            {
                if (JwtSecurityTokenHandler.DefaultOutboundClaimTypeMap.ContainsKey(claim.Type))
                {
                    filtered.Add(new Claim(JwtSecurityTokenHandler.DefaultOutboundClaimTypeMap[claim.Type], claim.Value));
                }
                else
                {
                    filtered.Add(claim);
                }
            }
        
            if (!filtered.Any(x=>x.Type == JwtClaimTypes.Name))
            {
                var first = filtered.FirstOrDefault(x => x.Type == JwtClaimTypes.GivenName)?.Value;
                var last = filtered.FirstOrDefault(x => x.Type == JwtClaimTypes.FamilyName)?.Value;
                if (first != null && last != null)
                {
                    filtered.Add(new Claim(JwtClaimTypes.Name, first + " " + last));
                }
            }

            var sub = Guid.NewGuid().ToString();
            var user = new InMemoryUser()
            {
                Enabled = true,
                Subject = sub,
                Username = sub,
                Provider = provider,
                ProviderId = userId,
                Claims = filtered
            };
            _users.Add(user);
            return user;
        }
    }
}
