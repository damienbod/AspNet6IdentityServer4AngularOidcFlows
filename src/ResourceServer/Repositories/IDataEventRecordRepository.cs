using System.Collections.Generic;
using ResourceServer.Model;
using Microsoft.AspNetCore.Mvc;

namespace ResourceServer.Repositories
{
    public interface IDataEventRecordRepository
    {
        void Delete(long id);
        DataEventRecord Get(long id);
        List<DataEventRecord> GetAll();
        void Post(DataEventRecord dataEventRecord);
        void Put(long id, [FromBody] DataEventRecord dataEventRecord);
    }
}