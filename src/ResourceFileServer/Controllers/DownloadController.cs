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
        public IActionResult Get(string id)
        {
            var filePath = $"{_appEnvironment.ApplicationBasePath}/SecuredFileShare/{id}";
            if(!System.IO.File.Exists(filePath))
            {
                return HttpBadRequest($"File does not exist: {id}");
            }

            var adminClaim = User.Claims.FirstOrDefault(x => x.Type == "role" && x.Value == "securedFiles.admin");
            if(_securedFileProvider.HasUserClaimToAccessFile(id, adminClaim != null))
            {
                var fileContents = System.IO.File.ReadAllBytes(filePath);
                return new FileContentResult(fileContents, "application/octet-stream");
            }

            return HttpUnauthorized();
        }
    }
}
