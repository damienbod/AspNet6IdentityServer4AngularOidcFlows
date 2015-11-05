using Microsoft.AspNet.Builder;
using Microsoft.AspNet.Http;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Api1
{
    public class RequiredScopesMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly IEnumerable<string> _requiredScopes;

        public RequiredScopesMiddleware(RequestDelegate next, List<string> requiredScopes)
        {
            _next = next;
            _requiredScopes = requiredScopes;
        }

        public async Task Invoke(HttpContext context)
        {
            if (context.User.Identity.IsAuthenticated)
            {
                if (!ScopePresent(context.User))
                {
                    context.Response.OnCompleted(Send403, context);
                    return;
                }
            }

            await _next(context);
        }
                
        private bool ScopePresent(ClaimsPrincipal principal)
        {
            foreach (var scope in principal.FindAll("scope"))
            {
                if (_requiredScopes.Contains(scope.Value))
                {
                    return true;
                }
            }

            return false;
        }

        private Task Send403(object contextObject)
        {
            var context = contextObject as HttpContext;
            context.Response.StatusCode = 403;

            return Task.FromResult(0);
        }
    }
}