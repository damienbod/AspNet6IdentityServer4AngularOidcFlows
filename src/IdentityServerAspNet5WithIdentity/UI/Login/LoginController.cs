namespace IdentityServerAspNet5WithIdentity.UI.Login
{
    using System;
    using System.Linq;
    using System.Security.Claims;
    using System.Threading.Tasks;

    using IdentityModel;

    using IdentityServer4.Core;
    using IdentityServer4.Core.Services;

    using Microsoft.AspNet.Mvc;

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

                    var name = user.Claims.Where(x => x.Type == Constants.ClaimTypes.Name).Select(x => x.Value).FirstOrDefault() ?? user.Username;

                    var claims = new Claim[] {
                        new Claim(Constants.ClaimTypes.Subject, user.Subject),
                        new Claim(Constants.ClaimTypes.Name, name),
                        new Claim(Constants.ClaimTypes.IdentityProvider, "idsvr"),
                        new Claim(Constants.ClaimTypes.AuthenticationTime, DateTime.UtcNow.ToEpochTime().ToString()),
                    };
                    var ci = new ClaimsIdentity(claims, "password", Constants.ClaimTypes.Name, Constants.ClaimTypes.Role);
                    var cp = new ClaimsPrincipal(ci);

                    await HttpContext.Authentication.SignInAsync(Constants.PrimaryAuthenticationType, cp);

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
    }
}
