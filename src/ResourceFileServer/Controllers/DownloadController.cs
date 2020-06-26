using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using ResourceFileServer.Providers;
using Microsoft.AspNetCore.Hosting;

namespace ResourceFileServer.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    public class DownloadController : Controller
    {
        private readonly IWebHostEnvironment _appEnvironment;
        private readonly ISecuredFileProvider _securedFileProvider;

        public DownloadController(ISecuredFileProvider securedFileProvider, IWebHostEnvironment appEnvironment)
        {
            _securedFileProvider = securedFileProvider;
            _appEnvironment = appEnvironment;
        }

        [AllowAnonymous]
        [HttpGet("{accessId}/{id}")]
        public IActionResult Get(string accessId, string id)
        {
            var filePath = _securedFileProvider.GetFileIdForUseOnceAccessId(accessId);
            if(!string.IsNullOrEmpty(filePath))
            {
                var fileContents = System.IO.File.ReadAllBytes(filePath);
                return new FileContentResult(fileContents, "application/octet-stream");
            }

            // returning a HTTP Forbidden result.
            return new StatusCodeResult(401);
        }

        [Authorize]
        //[Authorize("securedFilesUser")]
        [HttpGet("GenerateOneTimeAccessToken/{id}")]
        public IActionResult GenerateOneTimeAccessToken(string id)
        {
            if (!_securedFileProvider.FileIdExists(id))
            {
                return NotFound($"File id does not exist: {id}");
            }

            var filePath = $"{_appEnvironment.ContentRootPath}/SecuredFileShare/{id}";
            if (!System.IO.File.Exists(filePath))
            {
                return NotFound($"File does not exist: {id}");
            }

            var adminClaim = User.Claims.FirstOrDefault(x => x.Type == "role" && x.Value == "securedFiles.admin");
            if (_securedFileProvider.HasUserClaimToAccessFile(id, adminClaim != null))
            {
                // TODO generate a one time access token
                var oneTimeToken = _securedFileProvider.AddFileIdForUseOnceAccessId(filePath);
                return Ok(new DownloadToken { OneTimeToken = oneTimeToken });
            }

            // returning a HTTP Forbidden result.
            return new StatusCodeResult(403);
        }
    }
}
