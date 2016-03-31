using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ResourceFileServer.Providers
{
    public class SecuredFileProvider : ISecuredFileProvider
    {
        private List<string> _fileIds;

        private readonly UseOnceAccessIdService _useOnceAccessIdService;

        public SecuredFileProvider(UseOnceAccessIdService oneTimeTokenService)
        {
            // create the demo data, this could be data from a database or file provider...
            _fileIds = new List<string> { "securefile.txt", "securefileadmin.txt", "securefiletwo.txt" };
            _useOnceAccessIdService = oneTimeTokenService;
        }

        public string AddFileIdForUseOnceAccessId(string filePath)
        {
            return _useOnceAccessIdService.AddFileIdForUseOnceAccessId(filePath);
        }

        public bool FileIdExists(string fileId)
        {
            if(_fileIds.Contains(fileId.ToLower()))
            {
                return true;
            }

            return false;
        }

        public string GetFileIdForUseOnceAccessId(string oneTimeToken)
        {
           return _useOnceAccessIdService.GetFileIdForUseOnceAccessId(oneTimeToken);
        }

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

        public bool HasUserClaimToAccessFile(string fileId, bool isSecuredFilesAdmin)
        {
            if ("SecureFileAdmin.txt" == fileId && !isSecuredFilesAdmin)
            {
                return false;
            }

            return true;


        }
    }
}
