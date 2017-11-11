using Microsoft.AspNetCore.Localization;
using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Primitives;

namespace IdentityServerWithIdentitySQLite
{
    public class LocalizationQueryProvider : RequestCultureProvider
    {
        public static readonly string DefaultCookieName = "culture";

        public string QureyParamterName { get; set; } = DefaultCookieName;

        /// <inheritdoc />
        public override Task<ProviderCultureResult> DetermineProviderCultureResult(HttpContext httpContext)
        {
            if (httpContext == null)
            {
                throw new ArgumentNullException(nameof(httpContext));
            }

            var query = httpContext.Request.Query;
            var exists = query.TryGetValue("ui_locales", out StringValues culture);

            if (!exists)
            {
                return NullProviderCultureResult;
            }

            var providerResultCulture = ParseCookieValue(culture);

            return Task.FromResult(providerResultCulture);
        }

        public static ProviderCultureResult ParseCookieValue(string value)
        {
            if (string.IsNullOrWhiteSpace(value))
            {
                return null;
            }

            var cultureName = value;
            var uiCultureName = value;

            if (cultureName == null && uiCultureName == null)
            {
                // No values specified for either so no match
                return null;
            }

            if (cultureName != null && uiCultureName == null)
            {
                uiCultureName = cultureName;
            }

            if (cultureName == null && uiCultureName != null)
            {
                cultureName = uiCultureName;
            }

            return new ProviderCultureResult(cultureName, uiCultureName);
        }
    }
}
