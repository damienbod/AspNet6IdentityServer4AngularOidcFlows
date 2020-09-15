using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Fido2NetLib.Objects;
using Fido2NetLib;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using static Fido2NetLib.Fido2;
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
    public class MfaFido2RegisterController : Controller
    {
        private Fido2 _lib;
        public static IMetadataService _mds;
        private readonly Fido2Storage _fido2Storage;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IOptions<Fido2Configuration> _optionsFido2Configuration;
        private readonly IStringLocalizer _sharedLocalizer;

        public MfaFido2RegisterController(
            Fido2Storage fido2Storage,
            UserManager<ApplicationUser> userManager,
            IOptions<Fido2Configuration> optionsFido2Configuration,
            IStringLocalizerFactory factory)
        {
            _userManager = userManager;
            _optionsFido2Configuration = optionsFido2Configuration;
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
        [Route("/mfamakeCredentialOptions")]
        public async Task<JsonResult> MakeCredentialOptions([FromForm] string username, [FromForm] string displayName, [FromForm] string attType, [FromForm] string authType, [FromForm] bool requireResidentKey, [FromForm] string userVerification)
        {
            try
            {
                if (string.IsNullOrEmpty(username))
                {
                    username = $"{displayName} (Usernameless user created at {DateTime.UtcNow})";
                }

                var identityUser = await _userManager.FindByEmailAsync(username);
                var user = new Fido2User
                {
                    DisplayName = identityUser.UserName,
                    Name = identityUser.UserName,
                    Id = Encoding.UTF8.GetBytes(identityUser.UserName) // byte representation of userID is required
                };

                // 2. Get user existing keys by username
                var items = await _fido2Storage.GetCredentialsByUsername(identityUser.UserName);
                var existingKeys = new List<PublicKeyCredentialDescriptor>();
                foreach (var publicKeyCredentialDescriptor in items)
                {
                    existingKeys.Add(publicKeyCredentialDescriptor.Descriptor);
                }

                // 3. Create options
                var authenticatorSelection = new AuthenticatorSelection
                {
                    RequireResidentKey = requireResidentKey,
                    UserVerification = userVerification.ToEnum<UserVerificationRequirement>()
                };

                if (!string.IsNullOrEmpty(authType))
                    authenticatorSelection.AuthenticatorAttachment = authType.ToEnum<AuthenticatorAttachment>();

                var exts = new AuthenticationExtensionsClientInputs() { Extensions = true, UserVerificationIndex = true, Location = true, UserVerificationMethod = true, BiometricAuthenticatorPerformanceBounds = new AuthenticatorBiometricPerfBounds { FAR = float.MaxValue, FRR = float.MaxValue } };

                var options = _lib.RequestNewCredential(user, existingKeys, authenticatorSelection, attType.ToEnum<AttestationConveyancePreference>(), exts);

                // 4. Temporarily store options, session/in-memory cache/redis/db
                HttpContext.Session.SetString("fido2.attestationOptions", options.ToJson());

                // 5. return options to client
                return Json(options);
            }
            catch (Exception e)
            {
                return Json(new CredentialCreateOptions { Status = "error", ErrorMessage = FormatException(e) });
            }
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        [Route("/mfamakeCredential")]
        public async Task<JsonResult> MakeCredential([FromBody] AuthenticatorAttestationRawResponse attestationResponse)
        {
            try
            {
                // 1. get the options we sent the client
                var jsonOptions = HttpContext.Session.GetString("fido2.attestationOptions");
                var options = CredentialCreateOptions.FromJson(jsonOptions);

                // 2. Create callback so that lib can verify credential id is unique to this user
                IsCredentialIdUniqueToUserAsyncDelegate callback = async (IsCredentialIdUniqueToUserParams args) =>
                {
                    var users = await _fido2Storage.GetUsersByCredentialIdAsync(args.CredentialId);
                    if (users.Count > 0) return false;

                    return true;
                };

                // 2. Verify and make the credentials
                var success = await _lib.MakeNewCredentialAsync(attestationResponse, options, callback);

                // 3. Store the credentials in db
                await _fido2Storage.AddCredentialToUser(options.User, new FidoStoredCredential
                {
                    Username = options.User.Name,
                    Descriptor = new PublicKeyCredentialDescriptor(success.Result.CredentialId),
                    PublicKey = success.Result.PublicKey,
                    UserHandle = success.Result.User.Id,
                    SignatureCounter = success.Result.Counter,
                    CredType = success.Result.CredType,
                    RegDate = DateTime.Now,
                    AaGuid = success.Result.Aaguid
                });

                // 4. return "ok" to the client

                var user = await _userManager.GetUserAsync(User);
                if (user == null)
                {
                    return Json(new CredentialMakeResult { Status = "error", ErrorMessage = _sharedLocalizer["FIDO2_USER_NOTFOUND", _userManager.GetUserId(User)] });
                }

                await _userManager.SetTwoFactorEnabledAsync(user, true);
                var userId = await _userManager.GetUserIdAsync(user);

                return Json(success);
            }
            catch (Exception e)
            {
                return Json(new CredentialMakeResult { Status = "error", ErrorMessage = FormatException(e) });
            }
        }
    }
}
