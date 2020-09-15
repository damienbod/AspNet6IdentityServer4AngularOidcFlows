using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Threading.Tasks;
using Microsoft.Azure.KeyVault;
using Microsoft.Azure.KeyVault.Models;
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

        public async Task<(X509Certificate2 ActiveCertificate, X509Certificate2 SecondaryCertificate)> GetCertificatesFromKeyVault()
        {
            (X509Certificate2 ActiveCertificate, X509Certificate2 SecondaryCertificate) certs = (null, null);
            var azureServiceTokenProvider = new AzureServiceTokenProvider();
            var keyVaultClient = new KeyVaultClient(new KeyVaultClient.AuthenticationCallback(azureServiceTokenProvider.KeyVaultTokenCallback));

            var certificateItems = await GetAllEnabledCertificateVersionsAsync(keyVaultClient);
            var item = certificateItems.FirstOrDefault();
            if (item != null)
            {
                certs.ActiveCertificate = await GetCertificateAsync(item.Identifier.Identifier, keyVaultClient);
            }

            if (certificateItems.Count > 1)
            {
                certs.SecondaryCertificate = await GetCertificateAsync(certificateItems[1].Identifier.Identifier, keyVaultClient);
            }

            return certs;
        }

        private async Task<List<CertificateItem>> GetAllEnabledCertificateVersionsAsync(KeyVaultClient keyVaultClient)
        {
            // Get all the certificate versions (this will also get the currect active version
            var certificateVersions = await keyVaultClient.GetCertificateVersionsAsync(_keyVaultEndpoint, _certificateName);

            // Find all enabled versions of the certificate and sort them by creation date in decending order 
            return certificateVersions
              .Where(certVersion => certVersion.Attributes.Enabled.HasValue && certVersion.Attributes.Enabled.Value)
              .OrderByDescending(certVersion => certVersion.Attributes.Created)
              .ToList();
        }

        private async Task<X509Certificate2> GetCertificateAsync(string identitifier, KeyVaultClient keyVaultClient)
        {
            var certificateVersionBundle = await keyVaultClient.GetCertificateAsync(identitifier);
            var certificatePrivateKeySecretBundle = await keyVaultClient.GetSecretAsync(certificateVersionBundle.SecretIdentifier.Identifier);
            var privateKeyBytes = Convert.FromBase64String(certificatePrivateKeySecretBundle.Value);
            var certificateWithPrivateKey = new X509Certificate2(privateKeyBytes, (string)null, X509KeyStorageFlags.MachineKeySet);
            return certificateWithPrivateKey;
        }

    }
}