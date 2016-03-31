using System;

namespace ResourceFileServer.Providers
{
    internal class OneTimeToken
    {
        public OneTimeToken(string fileId)
        {
            Created = DateTime.UtcNow;
            Token = CreateToken();
            FileId = fileId;
        }

        public DateTime Created { get; }

        public string Token { get; }

        public string FileId { get; }

        private string CreateToken()
        {
            SecureRandom secureRandom = new SecureRandom();
            return secureRandom.Next() + Guid.NewGuid().ToString();
        }
    }
}