namespace AngularClient.ViewModel
{
    public class ClientAppSettings
    {
        public string  stsServer { get; set; }
        public string redirect_url { get; set; }
        public string client_id { get; set; }
        public string response_type { get; set; }
        public string scope { get; set; }
        public string post_logout_redirect_uri { get; set; }
        public bool start_checksession { get; set; }
        public bool silent_renew { get; set; }
        public string startup_route { get; set; }
        public string forbidden_route { get; set; }
        public string unauthorized_route { get; set; }
        public int logLevel { get; set; }
        public string max_id_token_iat_offset_allowed_in_seconds { get; set; }
        public string apiServer { get; set; }
        public string apiFileServer { get; set; }
    }
}
