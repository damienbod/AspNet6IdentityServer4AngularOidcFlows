using IdentityModel;
using IdentityServer4.Core;
using IdentityServer4.Core.Services;
using IdentityServer4.Core.Services.InMemory;
using Microsoft.AspNetCore.Http.Authentication;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Host.UI.Login
{
    public class LoginController : Controller
    {
        private readonly LoginService _loginService;
        private readonly SignInInteraction _signInInteraction;

        public LoginController(
            LoginService loginService, 
            SignInInteraction signInInteraction)
        {
            _loginService = loginService;
            _signInInteraction = signInInteraction;
        }

        [HttpGet(Constants.RoutePaths.Login, Name = "Login")]
        public async Task<IActionResult> Index(string id)
        {
            var vm = new LoginViewModel();

            if (id != null)
            {
                var request = await _signInInteraction.GetRequestAsync(id);
                if (request != null)
                {
                    vm.Username = request.LoginHint;
                    vm.SignInId = id;
                }
            }

            return View(vm);
        }

        [HttpPost(Constants.RoutePaths.Login)]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Index(LoginInputModel model)
        {
            if (ModelState.IsValid)
            {
                if (_loginService.ValidateCredentials(model.Username, model.Password))
                {
                    var user = _loginService.FindByUsername(model.Username);
                    await IssueCookie(user, "idsvr", "password");

                    if (model.SignInId != null)
                    {
                        return new SignInResult(model.SignInId);
                    }

                    return Redirect("~/");
                }

                ModelState.AddModelError("", "Invalid username or password.");
            }

            var vm = new LoginViewModel(model);
            return View(vm);
        }

        private async Task IssueCookie(
            InMemoryUser user, 
            string idp,
            string amr)
        {
            var name = user.Claims.Where(x => x.Type == JwtClaimTypes.Name).Select(x => x.Value).FirstOrDefault() ?? user.Username;

            var claims = new Claim[] {
                        new Claim(JwtClaimTypes.Subject, user.Subject),
                        new Claim(JwtClaimTypes.Name, name),
                        new Claim(JwtClaimTypes.IdentityProvider, idp),
                        new Claim(JwtClaimTypes.AuthenticationTime, DateTime.UtcNow.ToEpochTime().ToString()),
                    };
            var ci = new ClaimsIdentity(claims, amr, JwtClaimTypes.Name, JwtClaimTypes.Role);
            var cp = new ClaimsPrincipal(ci);

            await HttpContext.Authentication.SignInAsync(Constants.PrimaryAuthenticationType, cp);
        }

        [HttpGet("/ui/external/{provider}", Name = "External")]
        public IActionResult External(string provider, string signInId)
        {
            return new ChallengeResult(provider, new AuthenticationProperties
            {
                RedirectUri = "/ui/external-callback?signInId=" + signInId
            });
        }

        [HttpGet("/ui/external-callback")]
        public async Task<IActionResult> ExternalCallback(string signInId)
        {
            var tempUser = await HttpContext.Authentication.AuthenticateAsync("Temp");
            if (tempUser == null)
            {
                throw new Exception();
            }

            var claims = tempUser.Claims.ToList();

            var userIdClaim = claims.FirstOrDefault(x=>x.Type==JwtClaimTypes.Subject);
            if (userIdClaim == null)
            {
                userIdClaim = claims.FirstOrDefault(x=>x.Type==ClaimTypes.NameIdentifier);
            }
            if (userIdClaim == null)
            {
                throw new Exception("Unknown userid");
            }

            claims.Remove(userIdClaim);

            var provider = userIdClaim.Issuer;
            var userId = userIdClaim.Value;

            var user = _loginService.FindByExternalProvider(provider, userId);
            if (user == null)
            {
                user = _loginService.AutoProvisionUser(provider, userId, claims);
            }

            await IssueCookie(user, provider, "external");
            await HttpContext.Authentication.SignOutAsync("Temp");

            if (signInId != null)
            {
                return new SignInResult(signInId);
            }

            return Redirect("~/");

        }
    }
}
