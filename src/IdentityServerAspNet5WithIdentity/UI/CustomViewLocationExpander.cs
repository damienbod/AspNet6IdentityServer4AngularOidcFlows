namespace IdentityServerAspNet5WithIdentity.UI
{
    using System.Collections.Generic;

    using Microsoft.AspNet.Mvc.Razor;

    public class CustomViewLocationExpander : IViewLocationExpander
    {
        public IEnumerable<string> ExpandViewLocations(
            ViewLocationExpanderContext context,
            IEnumerable<string> viewLocations)
        {
            yield return "~/UI/{1}/Views/{0}.cshtml";
            yield return "~/UI/SharedViews/{0}.cshtml";
        }

        public void PopulateValues(ViewLocationExpanderContext context)
        {
        }
    }
}
