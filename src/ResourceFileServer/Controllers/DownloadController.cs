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
    public class DownloadController : Controller
    {
        private IApplicationEnvironment _appEnvironment;

        public DownloadController(IApplicationEnvironment appEnvironment)
        {
            _appEnvironment = appEnvironment;
        }

        [Authorize("securedFilesUser")]
        [HttpGet("{id}")]
        public FileContentResult Get(string id)
        {
            var fileContents = System.IO.File.ReadAllBytes($"{_appEnvironment.ApplicationBasePath}/SecuredFileShare/SecureFile.txt");
            return new FileContentResult(fileContents, "application/octet-stream");
        }
    }
}
