using IdentityServer4.Core.Models;
using IdentityServer4.Core.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using System.Threading.Tasks;

namespace Host.UI.Consent
{
    public class ConsentResult : IActionResult
    {
        private readonly string _requestId;
        private readonly ConsentResponse _response;

        public ConsentResult(string requestId, ConsentResponse response)
        {
            _requestId = requestId;
            _response = response;
        }

        public async Task ExecuteResultAsync(ActionContext context)
        {
            var interaction = context.HttpContext.RequestServices.GetRequiredService<ConsentInteraction>();
            await interaction.ProcessResponseAsync(_requestId, _response);
        }
    }
}
