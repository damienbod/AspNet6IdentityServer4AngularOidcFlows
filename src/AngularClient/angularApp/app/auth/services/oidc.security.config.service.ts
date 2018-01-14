import { Injectable } from '@angular/core';
import { OpenIDImplicitFlowConfiguration } from '../modules/auth.configuration';

@Injectable()
export class OidcConfigService {
    clientConfiguration: any;
    wellKnownEndpoints: any;

    constructor() {}

    async load(configUrl: string) {
        const response = await fetch(configUrl);
        this.clientConfiguration = await response.json()
        console.log('-- APP_INITIALIZER asyncFetchConfigClient completed --');

        const openIDImplicitFlowConfiguration = new OpenIDImplicitFlowConfiguration();
        openIDImplicitFlowConfiguration.stsServer = this.clientConfiguration.stsServer;
        openIDImplicitFlowConfiguration.redirect_url = this.clientConfiguration.redirect_url;
        // The Client MUST validate that the aud (audience) Claim contains its client_id value registered at the Issuer
        // identified by the iss (issuer) Claim as an audience.
        // The ID Token MUST be rejected if the ID Token does not list the Client as a valid audience,
        // or if it contains additional audiences not trusted by the Client.
        openIDImplicitFlowConfiguration.client_id = this.clientConfiguration.client_id;
        openIDImplicitFlowConfiguration.response_type = this.clientConfiguration.response_type;
        openIDImplicitFlowConfiguration.scope = this.clientConfiguration.scope;
        openIDImplicitFlowConfiguration.post_logout_redirect_uri = this.clientConfiguration.post_logout_redirect_uri;
        openIDImplicitFlowConfiguration.start_checksession = this.clientConfiguration.start_checksession;
        openIDImplicitFlowConfiguration.silent_renew = this.clientConfiguration.silent_renew;
        openIDImplicitFlowConfiguration.post_login_route = this.clientConfiguration.startup_route;
        // HTTP 403
        openIDImplicitFlowConfiguration.forbidden_route = this.clientConfiguration.forbidden_route;
        // HTTP 401
        openIDImplicitFlowConfiguration.unauthorized_route = this.clientConfiguration.unauthorized_route;
        openIDImplicitFlowConfiguration.log_console_warning_active = this.clientConfiguration.log_console_warning_active;
        openIDImplicitFlowConfiguration.log_console_debug_active = this.clientConfiguration.log_console_debug_active;
        // id_token C8: The iat Claim can be used to reject tokens that were issued too far away from the current time,
        // limiting the amount of time that nonces need to be stored to prevent attacks.The acceptable range is Client specific.
        openIDImplicitFlowConfiguration.max_id_token_iat_offset_allowed_in_seconds =
            this.clientConfiguration.max_id_token_iat_offset_allowed_in_seconds;

        await this.asyncFetchWellKnownConfiguration(openIDImplicitFlowConfiguration);
    }

    async asyncFetchWellKnownConfiguration(openIDImplicitFlowConfiguration: OpenIDImplicitFlowConfiguration) {
        const response = await fetch(`${openIDImplicitFlowConfiguration.stsServer}/.well-known/openid-configuration`);
        this.wellKnownEndpoints = await response.json()
        console.log('-- APP_INITIALIZER asyncFetchWellKnownConfiguration completed --');

        console.log(this.wellKnownEndpoints);
        console.log(this.clientConfiguration);
    }
}
