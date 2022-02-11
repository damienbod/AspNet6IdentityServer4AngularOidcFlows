using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ResourceFileServer.Providers;

public class UseOnceAccessIdService
{
    /// <summary>
    /// One time tokens live for a max of 30 seconds
    /// </summary>
    private double _timeToLive = 30.0;
    private static object lockObject = new object();

    private List<UseOnceAccessId> _useOnceAccessIds = new List<UseOnceAccessId>();

    public string GetFileIdForUseOnceAccessId(string useOnceAccessId)
    {
        var fileId = string.Empty;

        lock (lockObject)
        {

            // Max 30 seconds to start download after requesting one time token.
            _useOnceAccessIds.RemoveAll(t => t.Created < DateTime.UtcNow.AddSeconds(-_timeToLive));

            var item = _useOnceAccessIds.FirstOrDefault(t => t.AccessId == useOnceAccessId);
            if (item != null)
            {
                fileId = item.FileId;
                _useOnceAccessIds.Remove(item);
            }
        }

        return fileId;
    }
    public string AddFileIdForUseOnceAccessId(string filePath)
    {
        var useOnceAccessId = new UseOnceAccessId(filePath);
        lock (lockObject)
        {
            _useOnceAccessIds.Add(useOnceAccessId);
        }
        return useOnceAccessId.AccessId;
    }
}