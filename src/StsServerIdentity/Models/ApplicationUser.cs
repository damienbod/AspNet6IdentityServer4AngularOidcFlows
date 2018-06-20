using Microsoft.AspNetCore.Identity;
using System;

namespace StsServerIdentity.Models
{
    // Add profile data for application users by adding properties to the ApplicationUser class
    public class ApplicationUser : IdentityUser
    {
        public bool IsAdmin { get; set; }

        public bool IsVerkaufer{ get; set;}

        public bool IsVerifiedKunde { get; set; }

        public Guid LastSelectedVerkaufsgesellschaft { get; set; }

        public string Vorname { get; set; }

        public string Nachname { get; set; }
    }
}