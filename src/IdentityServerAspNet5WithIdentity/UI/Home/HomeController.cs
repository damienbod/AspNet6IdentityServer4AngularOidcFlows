namespace IdentityServerAspNet5WithIdentity.UI.Home
{
    using Microsoft.AspNet.Mvc;

    public class HomeController : Controller
    {
        [Route("/")]
        public IActionResult Index()
        {
            return View();
        }
    }
}
