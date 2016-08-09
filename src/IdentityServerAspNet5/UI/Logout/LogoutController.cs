using IdentityServer4;
using IdentityServer4.Services;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Host.UI.Logout
{
    public class LogoutController : Controller
    {
        private readonly IUserInteractionService _interaction;

        public LogoutController(IUserInteractionService interaction)
        {
            _interaction = interaction;
        }

        [HttpGet("ui/logout", Name = "Logout")]
        public IActionResult Index(string logoutId)
        {
            ViewData["logoutId"] = logoutId;
            return View();
        }

        [HttpPost("ui/logout")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Submit(string logoutId)
        {
            await HttpContext.Authentication.SignOutAsync(Constants.DefaultCookieAuthenticationScheme);

            // set this so UI rendering sees an anonymous user
            HttpContext.User = new ClaimsPrincipal(new ClaimsIdentity());

            var logout = await _interaction.GetLogoutContextAsync(logoutId);

            var vm = new LoggedOutViewModel()
            {
                PostLogoutRedirectUri = logout.PostLogoutRedirectUri,
                ClientName = logout.ClientId,
                SignOutIframeUrl = logout.SignOutIFrameUrl
            };
            return View("LoggedOut", vm);
        }
    }
}
