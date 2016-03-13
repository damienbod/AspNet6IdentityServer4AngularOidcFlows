using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ResourceFileServer.Providers
{
    public class SecuredFileProvider : ISecuredFileProvider
    {
        public List<string> GetFilesForUser(bool isSecuredFilesAdmin)
        {
            List<string> files = new List<string>();
            files.Add("SecureFile.txt");
            files.Add("SecureFileTwo.txt");

            // Use the claims to check if the logged in use has admin rights.
            if (isSecuredFilesAdmin)
            {
                files.Add("SecureFileAdmin.txt");
            }

            return files;
        }

        public bool HasUserClaimToAccessFile(string fileId, string claim)
        {
            throw new NotImplementedException();
        }
    }
}
