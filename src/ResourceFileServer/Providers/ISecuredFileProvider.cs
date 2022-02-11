using System.Collections.Generic;

namespace ResourceFileServer.Providers;

public interface ISecuredFileProvider
{
    bool FileIdExists(string id);

    bool HasUserClaimToAccessFile(string fileId, bool isSecuredFilesAdmin);

    List<string> GetFilesForUser(bool isSecuredFilesAdmin);
    string GetFileIdForUseOnceAccessId(string useOnceAccessId);
    string AddFileIdForUseOnceAccessId(string filePath);
}