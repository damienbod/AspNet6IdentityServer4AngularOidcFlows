using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ResourceFileServer.Providers
{
    public class OneTimeTokenService
    {
        /// <summary>
        /// One time tokens live for a max of 30 seconds
        /// </summary>
        private double _timeToLive = 30.0;
        private static object lockObject = new object();

        private List<OneTimeToken> _oneTimeTokens = new List<OneTimeToken>();

        public string GetFileIdForOneTimeToken(string oneTimeToken)
        {
            var fileId = string.Empty;

            lock(lockObject) {

                // Max 30 seconds to start download after requesting one time token.
                _oneTimeTokens.RemoveAll(t => t.Created < DateTime.UtcNow.AddSeconds(-_timeToLive));

                var item = _oneTimeTokens.FirstOrDefault(t => t.Token == oneTimeToken);
                if (item != null)
                {
                    fileId = item.FileId;
                    _oneTimeTokens.Remove(item);
                }
            }

            return fileId;
        }
        public string AddFileIdForOneTimeToken(string filePath)
        {
            var oneTimeToken = new OneTimeToken(filePath);
            lock (lockObject)
            {
                _oneTimeTokens.Add(oneTimeToken);
            }
            return oneTimeToken.Token;
        }
    }
}
