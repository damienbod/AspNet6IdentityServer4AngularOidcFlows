using Microsoft.AspNetCore.Mvc;

namespace Host.UI.Home
{
    public class HomeController : Controller
    {
        [Route("/")]
        public IActionResult Index()
        {
            return View();
        }
    }
}