using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace IdentityServerAspNet5WithIdentity.AspNetIdentity
{
    using Microsoft.AspNet.Identity.EntityFramework;

    public class MyUser : IdentityUser
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
    }
}
