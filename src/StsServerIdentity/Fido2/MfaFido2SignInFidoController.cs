using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Fido2NetLib.Objects;
using Fido2NetLib;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.IO;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using StsServerIdentity.Models;
using Microsoft.Extensions.Localization;
using StsServerIdentity.Resources;
using System.Reflection;

namespace StsServerIdentity
{

    [Route("api/[controller]")]
    public class MfaFido2SignInFidoController : Controller
    {
        private Fido2 _lib;
        public static IMetadataService _mds;
        private readonly Fido2Storage _fido2Storage;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IOptions<Fido2Configuration> _optionsFido2Configuration;
        private readonly IStringLocalizer _sharedLocalizer;

        public MfaFido2SignInFidoController(
            Fido2Storage fido2Storage,
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            IOptions<Fido2Configuration> optionsFido2Configuration,
            IStringLocalizerFactory factory)
        {
            _userManager = userManager;
            _optionsFido2Configuration = optionsFido2Configuration;
            _signInManager = signInManager;
            _userManager = userManager;
            _fido2Storage = fido2Storage;

            var type = typeof(SharedResource);
            var assemblyName = new AssemblyName(type.GetTypeInfo().Assembly.FullName);
            _sharedLocalizer = factory.Create("SharedResource", assemblyName.Name);

            _lib = new Fido2(new Fido2Configuration()
            {
                ServerDomain = _optionsFido2Configuration.Value.ServerDomain,
                ServerName = _optionsFido2Configuration.Value.ServerName,
                Origin = _optionsFido2Configuration.Value.Origin,
                TimestampDriftTolerance = _optionsFido2Configuration.Value.TimestampDriftTolerance
            });
        }

        private string FormatException(Exception e)
        {
            return string.Format("{0}{1}", e.Message, e.InnerException != null ? " (" + e.InnerException.Message + ")" : "");
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        [Route("/mfaassertionOptions")]
        public async Task<ActionResult> AssertionOptionsPost([FromForm] string username, [FromForm] string userVerification)
        {
            try
            {
                var identityUser = await _signInManager.GetTwoFactorAuthenticationUserAsync();
                if (identityUser == null)
                {
                    throw new InvalidOperationException(_sharedLocalizer["FIDO2_UNABLE_TO_LOAD_2FA_AUTHENTICATED_USER"]);
                }

                var existingCredentials = new List<PublicKeyCredentialDescriptor>();

                if (!string.IsNullOrEmpty(identityUser.UserName))
                {

                    var user = new Fido2User
                    {
                        DisplayName = identityUser.UserName,
                        Name = identityUser.UserName,
                        Id = Encoding.UTF8.GetBytes(identityUser.UserName) // byte representation of userID is required
                    };

                    if (user == null) throw new ArgumentException(_sharedLocalizer["FIDO2_USERNAME_NOT_REGISTERED"]);

                    // 2. Get registered credentials from database
                    var items = await _fido2Storage.GetCredentialsByUsername(identityUser.UserName);
                    existingCredentials = items.Select(c => c.Descriptor).ToList();
                }

                var exts = new AuthenticationExtensionsClientInputs() { SimpleTransactionAuthorization = "FIDO", GenericTransactionAuthorization = new TxAuthGenericArg { ContentType = "text/plain", Content = new byte[] { 0x46, 0x49, 0x44, 0x4F } }, UserVerificationIndex = true, Location = true, UserVerificationMethod = true };

                // 3. Create options
                var uv = string.IsNullOrEmpty(userVerification) ? UserVerificationRequirement.Discouraged : userVerification.ToEnum<UserVerificationRequirement>();
                var options = _lib.GetAssertionOptions(
                    existingCredentials,
                    uv,
                    exts
                );

                // 4. Temporarily store options, session/in-memory cache/redis/db
                HttpContext.Session.SetString("fido2.assertionOptions", options.ToJson());

                // 5. Return options to client
                return Json(options);
            }

            catch (Exception e)
            {
                return Json(new AssertionOptions { Status = "error", ErrorMessage = FormatException(e) });
            }
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        [Route("/mfamakeAssertion")]
        public async Task<JsonResult> MakeAssertion([FromBody] AuthenticatorAssertionRawResponse clientResponse)
        {
            try
            {
                // 1. Get the assertion options we sent the client
                var jsonOptions = HttpContext.Session.GetString("fido2.assertionOptions");
                var options = AssertionOptions.FromJson(jsonOptions);

                // 2. Get registered credential from database
                var creds = await _fido2Storage.GetCredentialById(clientResponse.Id);

                if (creds == null)
                {
                    throw new Exception(_sharedLocalizer["FIDO2_UNKNOWN_CREDENTIALS"]);
                }

                // 3. Get credential counter from database
                var storedCounter = creds.SignatureCounter;

                // 4. Create callback to check if userhandle owns the credentialId
                IsUserHandleOwnerOfCredentialIdAsync callback = async (args) =>
                {
                    var storedCreds = await _fido2Storage.GetCredentialsByUserHandleAsync(args.UserHandle);
                    return storedCreds.Exists(c => c.Descriptor.Id.SequenceEqual(args.CredentialId));
                };

                // 5. Make the assertion
                var res = await _lib.MakeAssertionAsync(clientResponse, options, creds.PublicKey, storedCounter, callback);

                // 6. Store the updated counter
                await _fido2Storage.UpdateCounter(res.CredentialId, res.Counter);

                // complete sign-in
                var user = await _signInManager.GetTwoFactorAuthenticationUserAsync();
                if (user == null)
                {
                    throw new InvalidOperationException(_sharedLocalizer["FIDO2_UNABLE_TO_LOAD_2FA_AUTHENTICATED_USER"]);
                }

                var result = await _signInManager.TwoFactorSignInAsync("FIDO2", string.Empty, false, false);

                // 7. return OK to client
                return Json(res);
            }
            catch (Exception e)
            {
                return Json(new AssertionVerificationResult { Status = "error", ErrorMessage = FormatException(e) });
            }
        }
    }
}
