using Microsoft.AspNetCore.Builder;

namespace StsServerIdentity
{
    public static class SecurityHeadersDefinitions
    {
        public static HeaderPolicyCollection GetHeaderPolicyCollection(bool isDev)
        {
            var policy = new HeaderPolicyCollection()
                .AddFrameOptionsDeny()
                .AddXssProtectionBlock()
                .AddContentTypeOptionsNoSniff()
                .AddReferrerPolicyStrictOriginWhenCrossOrigin()
                .RemoveServerHeader()
                .AddCrossOriginOpenerPolicy(builder =>
                {
                    builder.SameOrigin();
                })
                .AddCrossOriginEmbedderPolicy(builder =>
                {
                    builder.RequireCorp();
                })
                .AddCrossOriginResourcePolicy(builder =>
                {
                    builder.SameOrigin();
                })
                .AddContentSecurityPolicy(builder =>
                {
                    builder.AddObjectSrc().None();
                    builder.AddBlockAllMixedContent();
                    builder.AddImgSrc().Self().From("data:");
                    builder.AddFontSrc().Self();
                    builder.AddStyleSrc().Self().UnsafeInline();
                    builder.AddBaseUri().Self();
                    builder.AddScriptSrc().Self().UnsafeInline(); //.WithNonce();
                    builder.AddFrameAncestors().Self();

                    // removed this for demos add this back with explicit redirects for prod
                    // builder.AddFormAction().Self();

                    // builder.AddCustomDirective("require-trusted-types-for", "'script'");
                })
                .RemoveServerHeader()
                .AddPermissionsPolicy(builder =>
                {
                    builder.AddAccelerometer().None();
                    builder.AddAutoplay().None();
                    builder.AddCamera().None();
                    builder.AddEncryptedMedia().None();
                    builder.AddFullscreen().All();
                    builder.AddGeolocation().None();
                    builder.AddGyroscope().None();
                    builder.AddMagnetometer().None();
                    builder.AddMicrophone().None();
                    builder.AddMidi().None();
                    builder.AddPayment().None();
                    builder.AddPictureInPicture().None();
                    builder.AddSyncXHR().None();
                    builder.AddUsb().None();
                });

            if (!isDev)
            {
                // maxage = one year in seconds
                policy.AddStrictTransportSecurityMaxAgeIncludeSubDomains(maxAgeInSeconds: 60 * 60 * 24 * 365);
            }

            return policy;
        }
    }
}
