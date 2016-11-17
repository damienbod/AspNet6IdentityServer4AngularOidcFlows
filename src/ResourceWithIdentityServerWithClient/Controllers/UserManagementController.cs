using System;
using System.Collections.Generic;
using System.Linq;
using IdentityServerWithAspNetIdentity.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ResourceWithIdentityServerWithClient.Model;

namespace ResourceWithIdentityServerWithClient.Controllers
{
    // TODO add an admin policy
    [Authorize]
    [Produces("application/json")]
    [Route("api/UserManagement")]
    public class UserManagementController : Controller
    {
        private readonly ApplicationDbContext _context;

        public UserManagementController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult Get()
        {
            var users = _context.Users.ToList();
            var result = new List<UserDto>();

            foreach(var applicationUser in users)
            {
                var user = new UserDto
                {
                    Id = applicationUser.Id,
                    Name = applicationUser.Email,
                    IsAdmin = applicationUser.IsAdmin,
                    IsActive = applicationUser.AccountExpires > DateTime.UtcNow
                };

                result.Add(user);
            }

            return Ok(result);
        }

        [HttpPost]
        public IActionResult Post([FromBody]string value)
        {
            // TODO
            return NoContent();
        }
        
  
   
    }
}
