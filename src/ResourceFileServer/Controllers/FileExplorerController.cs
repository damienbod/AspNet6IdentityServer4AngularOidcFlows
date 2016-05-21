using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using ResourceFileServer.Providers;

namespace ResourceFileServer.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    public class FileExplorerController : Controller
    {
        private readonly ISecuredFileProvider _securedFileProvider;

        public FileExplorerController(ISecuredFileProvider securedFileProvider)
        {
            _securedFileProvider = securedFileProvider;
        }

        [Authorize("securedFilesUser")]
        [HttpGet]
        public IActionResult Get()
        {
            var adminClaim = User.Claims.FirstOrDefault(x => x.Type == "role" && x.Value == "securedFiles.admin");
            var files = _securedFileProvider.GetFilesForUser(adminClaim != null);

            return Ok(files);
        }
    }
}
