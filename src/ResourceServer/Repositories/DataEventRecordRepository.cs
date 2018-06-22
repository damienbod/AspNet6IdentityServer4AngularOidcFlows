using System.Collections.Generic;
using System.Linq;
using AspNet5SQLite.Model;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace AspNet5SQLite.Repositories
{
    public class DataEventRecordRepository : IDataEventRecordRepository
    {
        private readonly DataEventRecordContext _context;
        private readonly ILogger _logger;
        private IDataProtector _protector;

        public DataEventRecordRepository(DataEventRecordContext context, ILoggerFactory loggerFactory, IDataProtectionProvider provider)
        {
            _context = context;
            _logger = loggerFactory.CreateLogger("IDataEventRecordResporitory");
            _protector = provider.CreateProtector("DataEventRecordRepository.v1");
        }

        public List<DataEventRecord> GetAll()
        {
            _logger.LogCritical("Getting a the existing records");
            var data =  _context.DataEventRecords.ToList();
            foreach(var item in data)
            {
                unprotectDescription(item);
            }

            return data;
        }

        public DataEventRecord Get(long id)
        {
            var dataEventRecord = _context.DataEventRecords.First(t => t.Id == id);
            unprotectDescription(dataEventRecord);
            return dataEventRecord;
        }

        [HttpPost]
        public void Post(DataEventRecord dataEventRecord )
        {
            protectDescription(dataEventRecord);
            _context.DataEventRecords.Add(dataEventRecord);
            _context.SaveChanges();
        }

        public void Put(long id, [FromBody]DataEventRecord dataEventRecord)
        {
            protectDescription(dataEventRecord);
            _context.DataEventRecords.Update(dataEventRecord);
            _context.SaveChanges();
        }

        public void Delete(long id)
        {
            var entity = _context.DataEventRecords.First(t => t.Id == id);
            _context.DataEventRecords.Remove(entity);
            _context.SaveChanges();
        }

        private void protectDescription(DataEventRecord dataEventRecord)
        {
            var protectedData = _protector.Protect(dataEventRecord.Description);
            dataEventRecord.Description = protectedData;
        }

        private void unprotectDescription(DataEventRecord dataEventRecord)
        {
            var unprotectedData = _protector.Unprotect(dataEventRecord.Description);
            dataEventRecord.Description = unprotectedData;
        }
    }
}
