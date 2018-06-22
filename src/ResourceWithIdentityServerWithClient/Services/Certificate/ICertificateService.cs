using System.Security.Cryptography.X509Certificates;

namespace ResourceWithIdentityServerWithClient.Services.Certificate
{
    public interface ICertificateService
    {
        X509Certificate2 GetCertificateFromKeyVault(string vaultCertificateName);
    }
}