using Microsoft.AspNetCore.Localization;
using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace IdentityServerWithIdentitySQLite
{
    public class LocalizationCookieProvider : RequestCultureProvider
    {
        public static readonly string DefaultCookieName = ".AspNetCore.Culture";

        public string CookieName { get; set; } = DefaultCookieName;

        /// <inheritdoc />
        public override Task<ProviderCultureResult> DetermineProviderCultureResult(HttpContext httpContext)
        {
            if (httpContext == null)
            {
                throw new ArgumentNullException(nameof(httpContext));
            }

            var cookie = httpContext.Request.Cookies[CookieName];

            if (string.IsNullOrEmpty(cookie))
            {
                return NullProviderCultureResult;
            }

            var providerResultCulture = ParseCookieValue(cookie);

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
