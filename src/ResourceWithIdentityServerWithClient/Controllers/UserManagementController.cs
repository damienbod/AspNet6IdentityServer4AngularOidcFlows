using System;
using System.Collections.Generic;
using System.Linq;
using IdentityServerWithAspNetIdentity.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ResourceWithIdentityServerWithClient.Model;

namespace ResourceWithIdentityServerWithClient.Controllers
{
    [Authorize(AuthenticationSchemes = "Bearer", Policy ="admin")]
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
        
        [HttpPut("{id}")]
        public void Put(string id, [FromBody]UserDto userDto)
        {
            var user = _context.Users.First(t => t.Id == id);

            user.IsAdmin = userDto.IsAdmin;
            if(userDto.IsActive)
            {
                if(user.AccountExpires < DateTime.UtcNow)
                {
                    user.AccountExpires = DateTime.UtcNow.AddDays(7.0);
                }
            }
            else
            {
                // deactivate user
                user.AccountExpires = new DateTime();
            }

            _context.Users.Update(user);
            _context.SaveChanges();
        }   
    }
}
