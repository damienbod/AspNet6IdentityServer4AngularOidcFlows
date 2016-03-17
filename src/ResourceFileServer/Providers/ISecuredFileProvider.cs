using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ResourceFileServer.Providers
{
    public interface ISecuredFileProvider
    {
        bool FileIdExists(string id);

        bool HasUserClaimToAccessFile(string fileId, bool isSecuredFilesAdmin);

        List<string> GetFilesForUser(bool isSecuredFilesAdmin);
    }
}
