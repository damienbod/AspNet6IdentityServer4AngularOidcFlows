using IdentityServer4.Core;
using IdentityServer4.Core.Services;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Host.UI.Logout
{
    public class LogoutController : Controller
    {
        private readonly SignOutInteraction _signOutInteraction;

        public LogoutController(SignOutInteraction signOutInteraction)
        {
            _signOutInteraction = signOutInteraction;
        }

        [HttpGet(Constants.RoutePaths.Logout, Name = "Logout")]
        public IActionResult Index(string id)
        {
            return View(new LogoutViewModel { SignOutId = id });
        }

        [HttpPost(Constants.RoutePaths.Logout)]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Submit(string signOutId)
        {
            await HttpContext.Authentication.SignOutAsync(Constants.PrimaryAuthenticationType);

            // set this so UI rendering sees an anonymous user
            HttpContext.User = new ClaimsPrincipal(new ClaimsIdentity());

            var vm = new LoggedOutViewModel();
            return View("LoggedOut", vm);
        }
    }
}
