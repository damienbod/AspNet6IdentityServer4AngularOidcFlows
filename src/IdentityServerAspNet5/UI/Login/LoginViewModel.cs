namespace Host.UI.Login
{
    public class LoginViewModel : LoginInputModel
    {
        public LoginViewModel()
        {
        }

        public LoginViewModel(LoginInputModel other)
        {
            Username = other.Username;
            Password = other.Password;
            RememberLogin = other.RememberLogin;
            ReturnUrl = other.ReturnUrl;
        }

        public string ErrorMessage { get; set; }
    }
}