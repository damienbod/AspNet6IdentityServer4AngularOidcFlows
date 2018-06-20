using System.ComponentModel.DataAnnotations;

namespace StsServerIdentity.Models
{
    public class LoginInputModel
    {
        [Required(ErrorMessage = "emailRequired")]
        public string Email { get; set; }
        [Required(ErrorMessage = "passwordRequired")]
        public string Password { get; set; }
        public bool RememberLogin { get; set; }
        public string ReturnUrl { get; set; }
    }
}