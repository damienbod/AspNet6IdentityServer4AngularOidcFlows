namespace AspNet5SQLite.Repositories
{
    using System.Collections.Generic;

    using AspNet5SQLite.Model;

    using Microsoft.AspNet.Mvc;

    public interface IDataEventRecordRepository
    {
        void Delete(long id);
        DataEventRecord Get(long id);
        List<DataEventRecord> GetAll();
        void Post(DataEventRecord dataEventRecord);
        void Put(long id, [FromBody] DataEventRecord dataEventRecord);
    }
}