var AuthWellKnownEndpoints = (function () {
    function AuthWellKnownEndpoints() {
        this.issuer = '';
        this.jwks_uri = '';
        this.authorization_endpoint = '';
        this.token_endpoint = '';
        this.userinfo_endpoint = '';
        this.end_session_endpoint = '';
        this.check_session_iframe = '';
        this.revocation_endpoint = '';
        this.introspection_endpoint = '';
    }
    AuthWellKnownEndpoints.prototype.setWellKnownEndpoints = function (data) {
        this.issuer = data.issuer;
        this.jwks_uri = data.jwks_uri;
        this.authorization_endpoint = data.authorization_endpoint;
        this.token_endpoint = data.token_endpoint;
        this.userinfo_endpoint = data.userinfo_endpoint;
        if (data.end_session_endpoint) {
            this.end_session_endpoint = data.end_session_endpoint;
        }
        if (data.check_session_iframe) {
            this.check_session_iframe = data.check_session_iframe;
        }
        if (data.revocation_endpoint) {
            this.revocation_endpoint = data.revocation_endpoint;
        }
        if (data.introspection_endpoint) {
            this.introspection_endpoint = data.introspection_endpoint;
        }
    };
    return AuthWellKnownEndpoints;
}());
export { AuthWellKnownEndpoints };
//# sourceMappingURL=auth.well-known-endpoints.js.map