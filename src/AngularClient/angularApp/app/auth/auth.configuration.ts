import { Injectable } from '@angular/core';

@Injectable()
export class AuthConfiguration {

    // The Issuer Identifier for the OpenID Provider (which is typically obtained during Discovery) MUST exactly match the value of the iss (issuer) Claim.
    public iss = 'https://localhost:44318';

    public server = 'https://localhost:44318';

    public redirect_url = 'https://localhost:44311';

    // This is required to get the signing keys so that the signiture of the Jwt can be validated.
    public jwks_url = 'https://localhost:44318/.well-known/openid-configuration/jwks';

    // The Client MUST validate that the aud (audience) Claim contains its client_id value registered at the Issuer identified by the iss (issuer) Claim as an audience.
    // The ID Token MUST be rejected if the ID Token does not list the Client as a valid audience, or if it contains additional audiences not trusted by the Client.
    public client_id = 'angular2client';

    public response_type = 'id_token token';

    public scope = 'dataEventRecords securedFiles openid';

    public post_logout_redirect_uri = 'https://localhost:44311/Unauthorized';
}