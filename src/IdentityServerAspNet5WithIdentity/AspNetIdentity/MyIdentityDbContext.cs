using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace IdentityServerAspNet5WithIdentity.AspNetIdentity
{
    using Microsoft.AspNet.Identity.EntityFramework;
    using Microsoft.Data.Entity;

    public class MyIdentityDbContext : IdentityDbContext<MyUser>
    {
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
        }
    }

}
