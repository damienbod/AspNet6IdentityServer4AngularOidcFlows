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

    [Authorize]
    [Route("api/[controller]")]
    public class FileExplorerController : Controller
    {
        private IApplicationEnvironment _appEnvironment;

        public FileExplorerController(IApplicationEnvironment appEnvironment)
        {
            _appEnvironment = appEnvironment;
        }

        [Authorize("securedFilesUser")]
        [HttpGet]
        public IActionResult Get()
        {
            List<string> files = new List<string>();
            files.Add("SecureFile.txt");
            files.Add("SecureFileTwo.txt");

            // Use the claims to check if the logged in use has admin rights.
            if (true)
            {
                files.Add("SecureFileAdmin.txt");
            }

            return Ok(files);
        }
    }
}
