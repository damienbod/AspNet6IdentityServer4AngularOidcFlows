using Microsoft.AspNet.Mvc.Razor;
using System.Collections.Generic;

namespace IdSvrHost.UI
{
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
