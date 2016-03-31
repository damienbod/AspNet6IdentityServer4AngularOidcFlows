using System;

namespace ResourceFileServer.Providers
{
    internal class UseOnceAccessId
    {
        public UseOnceAccessId(string fileId)
        {
            Created = DateTime.UtcNow;
            AccessId = CreateAccessId();
            FileId = fileId;
        }

        public DateTime Created { get; }

        public string AccessId { get; }

        public string FileId { get; }

        private string CreateAccessId()
        {
            SecureRandom secureRandom = new SecureRandom();
            return secureRandom.Next() + Guid.NewGuid().ToString();
        }
    }
}