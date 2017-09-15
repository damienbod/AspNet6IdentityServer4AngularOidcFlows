using ResourceWithIdentityServerWithClient.Model;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System;

namespace ResourceWithIdentityServerWithClient.Controllers
{
    [Authorize(AuthenticationSchemes = "Bearer")]
    [Route("api/[controller]")]
    public class DataEventRecordsController : Controller
    {
        [Authorize("dataEventRecordsUser")]
        [HttpGet]
        public IActionResult Get()
        {
            return Ok(new List<DataEventRecord> { new DataEventRecord { Id =1, Description= "Fake", Name="myname", Timestamp= DateTime.UtcNow } });
        }

        [Authorize("dataEventRecordsAdmin")]
        [HttpGet("{id}")]
        public IActionResult Get(long id)
        {
            return Ok(new DataEventRecord { Id = 1, Description = "Fake", Name = "myname", Timestamp = DateTime.UtcNow });
        }

        [Authorize("dataEventRecordsAdmin")]
        [HttpPost]
        public void Post([FromBody]DataEventRecord value)
        {
            
        }

        [Authorize("dataEventRecordsAdmin")]
        [HttpPut("{id}")]
        public void Put(long id, [FromBody]DataEventRecord value)
        {
            
        }

        [Authorize("dataEventRecordsAdmin")]
        [HttpDelete("{id}")]
        public void Delete(long id)
        {
            
        }
    }
}
