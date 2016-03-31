using System.Linq;
using Microsoft.AspNet.Mvc;
using Microsoft.AspNet.Authorization;
using Microsoft.Extensions.PlatformAbstractions;
using ResourceFileServer.Providers;

namespace ResourceFileServer.Controllers
{
    //[Authorize]
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

        [HttpGet("{oneTimeToken}")]
        public IActionResult Get(string oneTimeToken)
        {
            var filePath = _securedFileProvider.GetFileIdForOneTimeToken(oneTimeToken);
            var fileContents = System.IO.File.ReadAllBytes(filePath);
            return new FileContentResult(fileContents, "application/octet-stream");
        }

        [Authorize("securedFilesUser")]
        [HttpGet("GenerateOneTimeAccessToken/{id}")]
        public IActionResult GenerateOneTimeAccessToken(string id)
        {
            if (!_securedFileProvider.FileIdExists(id))
            {
                return HttpNotFound($"File id does not exist: {id}");
            }

            var filePath = $"{_appEnvironment.ApplicationBasePath}/SecuredFileShare/{id}";
            if (!System.IO.File.Exists(filePath))
            {
                return HttpNotFound($"File does not exist: {id}");
            }

            var adminClaim = User.Claims.FirstOrDefault(x => x.Type == "role" && x.Value == "securedFiles.admin");
            if (_securedFileProvider.HasUserClaimToAccessFile(id, adminClaim != null))
            {
                // TODO generate a one time access token
                var token =_securedFileProvider.AddFileIdForOneTimeToken(filePath);
                return Ok(token);
            }

            // returning a HTTP Forbidden result.
            return new HttpStatusCodeResult(403);
        }
    }
}
