using Microsoft.AspNet.Authorization;
using Microsoft.AspNet.Mvc;
using Newtonsoft.Json.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace MvcClient
{
    [Authorize]
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        [AllowAnonymous]
        public async Task Signout()
        {
            await HttpContext.Authentication.SignOutAsync("oidc");
            await HttpContext.Authentication.SignOutAsync("Cookies");
        }

        public async Task<IActionResult> CallApi()
        {
            var token = User.FindFirst("access_token").Value;

            var client = new HttpClient();
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var response = await client.GetStringAsync("http://localhost:2025/claims");

            ViewBag.Json = JArray.Parse(response).ToString();
            return View();
        }
    }
}