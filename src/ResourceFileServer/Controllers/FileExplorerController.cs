using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.Mvc;

namespace ResourceFileServer.Controllers
{
    using Microsoft.AspNet.Authorization;
    using Microsoft.Extensions.PlatformAbstractions;
    using Providers;
    [Authorize]
    [Route("api/[controller]")]
    public class FileExplorerController : Controller
    {
        private readonly IApplicationEnvironment _appEnvironment;
        private readonly ISecuredFileProvider _securedFileProvider;

        public FileExplorerController(ISecuredFileProvider securedFileProvider, IApplicationEnvironment appEnvironment)
        {
            _securedFileProvider = securedFileProvider;
            _appEnvironment = appEnvironment;
        }

        [Authorize("securedFilesUser")]
        [HttpGet]
        public IActionResult Get()
        {
            bool isAdmin = User.Claims.Contains(new System.Security.Claims.Claim("role", "securedFiles.admin"));
            var files = _securedFileProvider.GetFilesForUser(isAdmin);

            return Ok(files);
        }
    }
}
