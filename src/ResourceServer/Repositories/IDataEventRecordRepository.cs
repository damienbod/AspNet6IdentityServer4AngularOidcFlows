using System.Collections.Generic;
using AspNet5SQLite.Model;
using Microsoft.AspNetCore.Mvc;

namespace AspNet5SQLite.Repositories
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