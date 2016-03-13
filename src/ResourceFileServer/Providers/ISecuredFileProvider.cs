using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ResourceFileServer.Providers
{
    public interface ISecuredFileProvider
    {
        bool HasUserClaimToAccessFile(string fileId, string claim);

        List<string> GetFilesForUser(bool isSecuredFilesAdmin);
    }
}
