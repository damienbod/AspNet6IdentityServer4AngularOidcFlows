using System.Threading.Tasks;

namespace StsServerIdentity.Services;

public interface IEmailSender
{
    Task SendEmail(string email, string subject, string message, string toUsername);
}
