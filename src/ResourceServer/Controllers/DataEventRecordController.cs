using AspNet5SQLite.Model;
using AspNet5SQLite.Repositories;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AspNet5SQLite.Controllers
{
    [Authorize("dataEventRecords")]
    [Route("api/[controller]")]
    public class DataEventRecordsController : Controller
    {
        private readonly IDataEventRecordRepository _dataEventRecordRepository;

        public DataEventRecordsController(IDataEventRecordRepository dataEventRecordRepository)
        {
            _dataEventRecordRepository = dataEventRecordRepository;
        }

        [Authorize("dataEventRecordsUser")]
        [HttpGet]
        public IActionResult Get()
        {
            return Ok(_dataEventRecordRepository.GetAll());
        }

        [Authorize("dataEventRecordsAdmin")]
        [HttpGet("{id}")]
        public IActionResult Get(long id)
        {
            return Ok(_dataEventRecordRepository.Get(id));
        }

        [Authorize("dataEventRecordsAdmin")]
        [HttpPost]
        public void Post([FromBody]DataEventRecord value)
        {
            _dataEventRecordRepository.Post(value);
        }

        [Authorize("dataEventRecordsAdmin")]
        [HttpPut("{id}")]
        public void Put(long id, [FromBody]DataEventRecord value)
        {
            _dataEventRecordRepository.Put(id, value);
        }

        [Authorize("dataEventRecordsAdmin")]
        [HttpDelete("{id}")]
        public void Delete(long id)
        {
            _dataEventRecordRepository.Delete(id);
        }
    }
}
