using Azure.Identity;
using Azure.Security.KeyVault.Certificates;
using Azure.Security.KeyVault.Secrets;
using System;
using System.Security.Cryptography.X509Certificates;
using System.Threading.Tasks;

namespace StsServerIdentity.Services.Certificate
{
    public static class CertificateService
    {
        public static async Task<(X509Certificate2 ActiveCertificate, X509Certificate2 SecondaryCertificate)> GetCertificates(CertificateConfiguration certificateConfiguration)
        {
            (X509Certificate2 ActiveCertificate, X509Certificate2 SecondaryCertificate) certs = (null, null);

            if (certificateConfiguration.UseLocalCertStore)
            {
                using X509Store store = new X509Store(StoreName.My, StoreLocation.LocalMachine);
                store.Open(OpenFlags.ReadOnly);
                var storeCerts = store.Certificates.Find(X509FindType.FindByThumbprint, certificateConfiguration.CertificateThumbprint, false);
                certs.ActiveCertificate = storeCerts[0];
                store.Close();
            }
            else
            {
                if (!string.IsNullOrEmpty(certificateConfiguration.KeyVaultEndpoint))
                {
                    var credential = new DefaultAzureCredential();
                    var keyVaultCertificateService = new KeyVaultCertificateService(
                            certificateConfiguration.KeyVaultEndpoint,
                            certificateConfiguration.CertificateNameKeyVault);

                    var secretClient = new SecretClient(
                        vaultUri: new Uri(certificateConfiguration.KeyVaultEndpoint),
                        credential);

                    var certificateClient = new CertificateClient(
                        vaultUri: new Uri(certificateConfiguration.KeyVaultEndpoint),
                        credential);

                    certs = await keyVaultCertificateService.GetCertificatesFromKeyVault(secretClient, certificateClient).ConfigureAwait(false);
                }
            }

            // search for local PFX with password, usually local dev
            if (certs.ActiveCertificate == null)
            {
                certs.ActiveCertificate = new X509Certificate2(
                    certificateConfiguration.DevelopmentCertificatePfx,
                    certificateConfiguration.DevelopmentCertificatePassword);
            }

            return certs;
        }
    }
}
