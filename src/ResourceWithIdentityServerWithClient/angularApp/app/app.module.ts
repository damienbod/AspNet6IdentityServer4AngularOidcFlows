import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { Configuration } from './app.constants';
import { routing } from './app.routes';

import { HttpClientModule } from '@angular/common/http';

import { ForbiddenComponent } from './forbidden/forbidden.component';
import { HomeComponent } from './home/home.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';

import { UserManagementComponent } from './user-management/user-management.component';

import { NavigationComponent } from './navigation/navigation.component';

import { HasAdminRoleAuthenticationGuard } from './guards/hasAdminRoleAuthenticationGuard';
import { HasAdminRoleCanLoadGuard } from './guards/hasAdminRoleCanLoadGuard';
import { UserManagementService } from './user-management/UserManagementService';

import { AuthModule } from './auth/modules/auth.module';
import { OidcSecurityService } from './auth/services/oidc.security.service';
import { OpenIDImplicitFlowConfiguration } from './auth/modules/auth.configuration';

import { DataEventRecordsModule } from './dataeventrecords/dataeventrecords.module';
import { AuthWellKnownEndpoints } from './auth/models/auth.well-known-endpoints';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        routing,
        HttpClientModule,
        DataEventRecordsModule,
        AuthModule.forRoot(),
    ],
    declarations: [
        AppComponent,
        ForbiddenComponent,
        HomeComponent,
        UnauthorizedComponent,
        UserManagementComponent,
        NavigationComponent,
    ],
    providers: [
        OidcSecurityService,
        UserManagementService,
        Configuration,
        HasAdminRoleAuthenticationGuard,
        HasAdminRoleCanLoadGuard
    ],
    bootstrap: [AppComponent],
})

export class AppModule {
    constructor(
        public oidcSecurityService: OidcSecurityService
    ) {
        const openIDImplicitFlowConfiguration = new OpenIDImplicitFlowConfiguration();

        openIDImplicitFlowConfiguration.stsServer = 'https://localhost:44363';
        openIDImplicitFlowConfiguration.redirect_url = 'https://localhost:44363';
        // The Client MUST validate that the aud (audience) Claim contains its client_id value registered at the Issuer identified by the iss (issuer) Claim as an audience.
        // The ID Token MUST be rejected if the ID Token does not list the Client as a valid audience, or if it contains additional audiences not trusted by the Client.
        openIDImplicitFlowConfiguration.client_id = 'singleapp';
        openIDImplicitFlowConfiguration.response_type = 'id_token token';
        openIDImplicitFlowConfiguration.scope = 'dataEventRecords openid';
        openIDImplicitFlowConfiguration.post_logout_redirect_uri = 'https://localhost:44363/Unauthorized';
        openIDImplicitFlowConfiguration.start_checksession = false;
        openIDImplicitFlowConfiguration.silent_renew = true;
        openIDImplicitFlowConfiguration.silent_renew_url = 'https://localhost:44363/silent-renew.html';
        openIDImplicitFlowConfiguration.post_login_route = '/dataeventrecords';
        // HTTP 403
        openIDImplicitFlowConfiguration.forbidden_route = '/Forbidden';
        // HTTP 401
        openIDImplicitFlowConfiguration.unauthorized_route = '/Unauthorized';
        openIDImplicitFlowConfiguration.log_console_warning_active = true;
        openIDImplicitFlowConfiguration.log_console_debug_active = true;
        // id_token C8: The iat Claim can be used to reject tokens that were issued too far away from the current time,
        // limiting the amount of time that nonces need to be stored to prevent attacks.The acceptable range is Client specific.
        openIDImplicitFlowConfiguration.max_id_token_iat_offset_allowed_in_seconds = 10;

        const authWellKnownEndpoints = new AuthWellKnownEndpoints();
        authWellKnownEndpoints.issuer = 'https://localhost:44363';
        authWellKnownEndpoints.jwks_uri = 'https://localhost:44363/.well-known/openid-configuration/jwks';
        authWellKnownEndpoints.authorization_endpoint = 'https://localhost:44363/connect/authorize';
        authWellKnownEndpoints.token_endpoint = 'https://localhost:44363/connect/token';
        authWellKnownEndpoints.userinfo_endpoint = 'https://localhost:44363/connect/userinfo';
        authWellKnownEndpoints.end_session_endpoint = 'https://localhost:44363/connect/endsession';
        authWellKnownEndpoints.check_session_iframe = 'https://localhost:44363/connect/checksession';
        authWellKnownEndpoints.revocation_endpoint = 'https://localhost:44363/connect/revocation';
        authWellKnownEndpoints.introspection_endpoint = 'https://localhost:44363/connect/introspect';

        this.oidcSecurityService.setupModule(openIDImplicitFlowConfiguration, authWellKnownEndpoints);
    }
}

