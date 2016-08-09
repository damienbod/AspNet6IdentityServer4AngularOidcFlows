using IdentityServer4;
using IdentityServer4.Services;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Host.UI.Error
{
    public class ErrorController : Controller
    {
        private readonly IUserInteractionService _interaction;

        public ErrorController(IUserInteractionService interaction)
        {
            _interaction = interaction;
        }

        [Route("ui/error", Name ="Error")]
        public async Task<IActionResult> Index(string errorId)
        {
            var vm = new ErrorViewModel();

            if (errorId != null)
            {
                var message = await _interaction.GetErrorContextAsync(errorId);
                if (message != null)
                {
                    vm.Error = message;
                }
            }

            return View("Error", vm);
        }
    }
}
