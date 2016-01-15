namespace IdentityServerAspNet5.UI.Logout
{
    using System.Collections.Generic;
    using System.Linq;

    using IdentityServer4.Core.Models;

    public class LoggedOutViewModel
    {
        public LoggedOutViewModel()
        {
            SignOutIFrameUrls = Enumerable.Empty<string>();
        }

        public ClientReturnInfo ReturnInfo { get; set; }
        public string ClientName { get; set; }

        public IEnumerable<string> SignOutIFrameUrls { get; set; }
    }
}
