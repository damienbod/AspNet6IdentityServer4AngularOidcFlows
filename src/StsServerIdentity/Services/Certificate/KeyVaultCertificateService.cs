using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Threading.Tasks;
using Azure.Security.KeyVault.Certificates;
using Azure.Security.KeyVault.Secrets;
using Microsoft.Azure.Services.AppAuthentication;

namespace StsServerIdentity.Services.Certificate
{
    public class KeyVaultCertificateService
    {
        private readonly string _keyVaultEndpoint;
        private readonly string _certificateName;

        public KeyVaultCertificateService(string keyVaultEndpoint, string certificateName)
        {
            if (string.IsNullOrEmpty(keyVaultEndpoint))
            {
                throw new ArgumentException("missing keyVaultEndpoint");
            }

            _keyVaultEndpoint = keyVaultEndpoint; // "https://damienbod.vault.azure.net"
            _certificateName = certificateName; // certificateName
        }

        public async Task<(X509Certificate2 ActiveCertificate, X509Certificate2 SecondaryCertificate)> GetCertificatesFromKeyVault(
            SecretClient secretClient, CertificateClient certificateClient)
        {
            (X509Certificate2 ActiveCertificate, X509Certificate2 SecondaryCertificate) certs = (null, null);

            var certificateItems = GetAllEnabledCertificateVersions(certificateClient);
            var item = certificateItems.FirstOrDefault();
            if (item != null)
            {
                certs.ActiveCertificate = await GetCertificateAsync(
                    secretClient, _certificateName, item.Version);
            }

            if (certificateItems.Count > 1)
            {
                certs.SecondaryCertificate = await GetCertificateAsync(
                    secretClient, _certificateName, certificateItems[1].Version);
            }

            return certs;
        }

        private List<CertificateProperties> GetAllEnabledCertificateVersions(
            CertificateClient certificateClient)
        {
            var certificateVersions = certificateClient.GetPropertiesOfCertificateVersions(_certificateName);
            var certificateItems = certificateVersions.ToList();

            // Find all enabled versions of the certificate and sort them by creation date in decending order 
            return certificateVersions
              .Where(certVersion => certVersion.Enabled.HasValue && certVersion.Enabled.Value)
              .OrderByDescending(certVersion => certVersion.CreatedOn)
              .ToList();
        }

        private async Task<X509Certificate2> GetCertificateAsync(
            SecretClient secretClient,
            string certName,
            string version)
        {
            // Create a new secret using the secret client.
            var secretName = certName;
            KeyVaultSecret secret = await secretClient.GetSecretAsync(secretName, version);

            var privateKeyBytes = Convert.FromBase64String(secret.Value);

            var certificateWithPrivateKey = new X509Certificate2(privateKeyBytes,
                (string)null,
                X509KeyStorageFlags.MachineKeySet);

            return certificateWithPrivateKey;
        }

    }
}