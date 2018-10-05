import { NgModule, APP_INITIALIZER } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { Configuration } from './app.constants';
import { routing } from './app.routes';

import { HttpClientModule } from '@angular/common/http';

import { ForbiddenComponent } from './forbidden/forbidden.component';
import { HomeComponent } from './home/home.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';

import { AuthModule } from './auth/modules/auth.module';
import { OidcSecurityService } from './auth/services/oidc.security.service';
import { OpenIDImplicitFlowConfiguration } from './auth/modules/auth.configuration';
import { OidcConfigService } from './auth/services/oidc.security.config.service';
import { AuthWellKnownEndpoints } from './auth/models/auth.well-known-endpoints';

export function loadConfig(oidcConfigService: OidcConfigService) {
    console.log('APP_INITIALIZER STARTING');
    return () => oidcConfigService.load_using_stsServer('https://localhost:44318');
}

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        routing,
        HttpClientModule,
        AuthModule.forRoot(),
    ],
    declarations: [
        AppComponent,
        ForbiddenComponent,
        HomeComponent,
        UnauthorizedComponent
    ],
    providers: [
        OidcConfigService,
        OidcSecurityService,
        {
            provide: APP_INITIALIZER,
            useFactory: loadConfig,
            deps: [OidcConfigService],
            multi: true
        },
        Configuration
    ],
    bootstrap: [AppComponent],
})


export class AppModule {
    constructor(
        private oidcSecurityService: OidcSecurityService,
        private oidcConfigService: OidcConfigService,
    ) {

        this.oidcConfigService.onConfigurationLoaded.subscribe(() => {
            const openIDImplicitFlowConfiguration = new OpenIDImplicitFlowConfiguration();

            const flowType = 'id_token';

            // const flowType = 'id_token token';
            // openIDImplicitFlowConfiguration.auto_userinfo = false;

            openIDImplicitFlowConfiguration.stsServer = 'https://localhost:44318';
            openIDImplicitFlowConfiguration.redirect_url = 'https://localhost:44372';
            // The Client MUST validate that the aud (audience) Claim contains its client_id value registered at the Issuer identified by the iss (issuer) Claim as an audience.
            // The ID Token MUST be rejected if the ID Token does not list the Client as a valid audience, or if it contains additional audiences not trusted by the Client.
            openIDImplicitFlowConfiguration.client_id = 'angularclientidtokenonly';
            openIDImplicitFlowConfiguration.response_type = flowType;
            openIDImplicitFlowConfiguration.scope = 'openid profile email';
            openIDImplicitFlowConfiguration.post_logout_redirect_uri = 'https://localhost:44372/Unauthorized';
            openIDImplicitFlowConfiguration.start_checksession = false;
            openIDImplicitFlowConfiguration.silent_renew = true;
            openIDImplicitFlowConfiguration.silent_renew_url = 'https://localhost:44372/silent-renew.html';
            openIDImplicitFlowConfiguration.post_login_route = '/home';
            // HTTP 403
            openIDImplicitFlowConfiguration.forbidden_route = '/Forbidden';
            // HTTP 401
            openIDImplicitFlowConfiguration.unauthorized_route = '/Unauthorized';
            openIDImplicitFlowConfiguration.log_console_warning_active = true;
            openIDImplicitFlowConfiguration.log_console_debug_active = false;
            // id_token C8: The iat Claim can be used to reject tokens that were issued too far away from the current time,
            // limiting the amount of time that nonces need to be stored to prevent attacks.The acceptable range is Client specific.
            openIDImplicitFlowConfiguration.max_id_token_iat_offset_allowed_in_seconds = 3;
            openIDImplicitFlowConfiguration.auto_clean_state_after_authentication = false;

            const authWellKnownEndpoints = new AuthWellKnownEndpoints();
            authWellKnownEndpoints.setWellKnownEndpoints(this.oidcConfigService.wellKnownEndpoints);

            this.oidcSecurityService.setupModule(openIDImplicitFlowConfiguration, authWellKnownEndpoints);

        });
    }
}
