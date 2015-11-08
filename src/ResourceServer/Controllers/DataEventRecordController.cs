namespace AspNet5SQLite.Controllers
{
    using System.Collections.Generic;

    using AspNet5SQLite.Model;
    using AspNet5SQLite.Repositories;

    using Microsoft.AspNet.Authorization;
    using Microsoft.AspNet.Mvc;

    [Authorize]
    [Route("api/[controller]")]
    public class DataEventRecordsController : Controller
    {
        private readonly IDataEventRecordRepository _dataEventRecordRepository;

        public DataEventRecordsController(IDataEventRecordRepository dataEventRecordRepository)
        {
            _dataEventRecordRepository = dataEventRecordRepository;
        }

        [HttpGet]
        public IEnumerable<DataEventRecord> Get()
        {
            return _dataEventRecordRepository.GetAll();
        }

        [HttpGet("{id}")]
        public DataEventRecord Get(long id)
        {
            return _dataEventRecordRepository.Get(id);
        }

        [HttpPost]
        public void Post([FromBody]DataEventRecord value)
        {
            _dataEventRecordRepository.Post(value);
        }

        [HttpPut("{id}")]
        public void Put(long id, [FromBody]DataEventRecord value)
        {
            _dataEventRecordRepository.Put(id, value);
        }

        [HttpDelete("{id}")]
        public void Delete(long id)
        {
            _dataEventRecordRepository.Delete(id);
        }
    }
}
