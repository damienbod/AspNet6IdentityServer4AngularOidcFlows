using IdentityModel.Client;
using Newtonsoft.Json.Linq;
using System;
using System.Net.Http;

namespace TestClient
{
    class Program
    {
        static void Main(string[] args)
        {
            var response = GetToken();

            var client = new HttpClient();
            client.SetBearerToken(response.AccessToken);

            var result = client.GetStringAsync("http://localhost:2025/claims").Result;
            Console.WriteLine(JArray.Parse(result));
        }

        static TokenResponse GetToken()
        {
            var client = new TokenClient(
                "https://localhost:44300/connect/token",
                "test",
                "secret");

            return client.RequestClientCredentialsAsync("api1").Result;
        }
    }
}