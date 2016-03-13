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
    public class DownloadController : Controller
    {
        private readonly IApplicationEnvironment _appEnvironment;
        private readonly ISecuredFileProvider _securedFileProvider;

        public DownloadController(ISecuredFileProvider securedFileProvider, IApplicationEnvironment appEnvironment)
        {
            _securedFileProvider = securedFileProvider;
            _appEnvironment = appEnvironment;
        }

        [Authorize("securedFilesUser")]
        [HttpGet("{id}")]
        public FileContentResult Get(string id)
        {
            // TODO add file validation and authorization check

            var fileContents = System.IO.File.ReadAllBytes($"{_appEnvironment.ApplicationBasePath}/SecuredFileShare/SecureFile.txt");
            return new FileContentResult(fileContents, "application/octet-stream");
        }
    }
}
