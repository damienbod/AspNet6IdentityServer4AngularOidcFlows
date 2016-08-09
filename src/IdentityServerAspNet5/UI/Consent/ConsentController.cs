using IdentityServer4;
using IdentityServer4.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Linq;
using System.Threading.Tasks;
using IdentityServer4.Models;

namespace Host.UI.Consent
{
    public class ConsentController : Controller
    {
        private readonly ILogger<ConsentController> _logger;
        private readonly IClientStore _clientStore;
        private readonly IUserInteractionService _interaction;
        private readonly IScopeStore _scopeStore;
        private readonly ILocalizationService _localization;

        public ConsentController(
            ILogger<ConsentController> logger,
            IUserInteractionService interaction,
            IClientStore clientStore,
            IScopeStore scopeStore,
            ILocalizationService localization)
        {
            _logger = logger;
            _interaction = interaction;
            _clientStore = clientStore;
            _scopeStore = scopeStore;
            _localization = localization;
        }

        [HttpGet("ui/consent", Name = "Consent")]
        public async Task<IActionResult> Index(string returnUrl)
        {
            var vm = await BuildViewModelAsync(returnUrl);
            if (vm != null)
            {
                return View("Index", vm);
            }

            return View("Error");
        }

        [HttpPost("ui/consent")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Index(string button, ConsentInputModel model)
        {
            var request = await _interaction.GetConsentContextAsync(model.ReturnUrl);
            ConsentResponse response = null;

            if (button == "no")
            {
                response = ConsentResponse.Denied;
            }
            else if (button == "yes" && model != null)
            {
                if (model.ScopesConsented != null && model.ScopesConsented.Any())
                {
                    response = new ConsentResponse
                    {
                        RememberConsent = model.RememberConsent,
                        ScopesConsented = model.ScopesConsented
                    };
                }
                else
                {
                    ModelState.AddModelError("", "You must pick at least one permission.");
                }
            }
            else
            {
                ModelState.AddModelError("", "Invalid Selection");
            }

            if (response != null)
            {
                await _interaction.GrantConsentAsync(request, response);
                return Redirect(model.ReturnUrl);
            }

            var vm = await BuildViewModelAsync(model.ReturnUrl, model);
            if (vm != null)
            {
                return View("Index", vm);
            }

            return View("Error");
        }

        //async Task<IActionResult> BuildConsentResponse(string id, string[] scopesConsented, bool rememberConsent)
        //{
        //    if (id != null)
        //    {
        //        var request = await _interaction.GetRequestAsync(id);
        //    }

        //    return View("Error");
        //}

        async Task<ConsentViewModel> BuildViewModelAsync(string returnUrl, ConsentInputModel model = null)
        {
            if (returnUrl != null)
            {
                var request = await _interaction.GetConsentContextAsync(returnUrl);
                if (request != null)
                {
                    var client = await _clientStore.FindClientByIdAsync(request.ClientId);
                    if (client != null)
                    {
                        var scopes = await _scopeStore.FindScopesAsync(request.ScopesRequested);
                        if (scopes != null && scopes.Any())
                        {
                            return new ConsentViewModel(model, returnUrl, request, client, scopes, _localization);
                        }
                        else
                        {
                            _logger.LogError("No scopes matching: {0}", request.ScopesRequested.Aggregate((x, y) => x + ", " + y));
                        }
                    }
                    else
                    {
                        _logger.LogError("Invalid client id: {0}", request.ClientId);
                    }
                }
                else
                {
                    _logger.LogError("No consent request matching id: {0}", returnUrl);
                }
            }
            else
            {
                _logger.LogError("No returnUrl passed");
            }

            return null;
        }
    }
}
