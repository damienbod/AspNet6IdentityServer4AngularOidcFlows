using System.Globalization;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Primitives;
using System;
using Microsoft.AspNetCore.WebUtilities;
using System.Linq;

namespace IdentityServerWithAspNetIdentity.Filters
{
    public class LanguageActionFilter : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            //string culture = context..Values["ui_locales"].ToString();
            var query = context.HttpContext.Request.Query;
            var exists = query.TryGetValue("ui_locales", out StringValues culture);
            if (exists)
            {
                var requestCulture = culture.ToArray()[0];
#if NET451
            System.Threading.Thread.CurrentThread.CurrentCulture = new CultureInfo(requestCulture);
            System.Threading.Thread.CurrentThread.CurrentUICulture = new CultureInfo(requestCulture);
#elif NET46
            System.Threading.Thread.CurrentThread.CurrentCulture = new CultureInfo(requestCulture);
            System.Threading.Thread.CurrentThread.CurrentUICulture = new CultureInfo(requestCulture);
#else
                CultureInfo.CurrentCulture = new CultureInfo(requestCulture);
                CultureInfo.CurrentUICulture = new CultureInfo(requestCulture);
#endif
            }
            else
            {
                exists = query.TryGetValue("returnUrl", out StringValues requesturl);
                // hack because Identityserver4 does some magic here...
                // Need to set the culture manually
                if (exists)
                {
                    var request = requesturl.ToArray()[0];
                    Uri uri = new Uri("http://faketopreventexception" + request);
                    var query1 = QueryHelpers.ParseQuery(uri.Query);
                    var requestCulture = query1.FirstOrDefault(t => t.Key == "ui_locales").Value;

                    // TODO check for exists
                    CultureInfo.CurrentCulture = new CultureInfo(requestCulture);
                    CultureInfo.CurrentUICulture = new CultureInfo(requestCulture);
                }
            }

            base.OnActionExecuting(context);
        }
    }
}