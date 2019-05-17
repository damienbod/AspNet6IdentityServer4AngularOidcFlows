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
import { DataEventRecordsModule } from './dataeventrecords/dataeventrecords.module';
import { NavigationComponent } from './navigation/navigation.component';
import { HasAdminRoleAuthenticationGuard } from './guards/hasAdminRoleAuthenticationGuard';
import { HasAdminRoleCanLoadGuard } from './guards/hasAdminRoleCanLoadGuard';
import { UserManagementService } from './user-management/UserManagementService';

import { AuthModule } from './auth/modules/auth.module';
import { OidcSecurityService } from './auth/services/oidc.security.service';
import { AuthWellKnownEndpoints } from './auth/models/auth.well-known-endpoints';
import { OpenIdConfiguration } from './auth/models/auth.configuration';

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
        const config: OpenIdConfiguration = {
            stsServer: 'https://localhost:44363',
            redirect_url: 'https://localhost:44363',
            client_id: 'singleapp',
            response_type: 'id_token token',
            scope: 'dataEventRecords openid',
            post_logout_redirect_uri: 'https://localhost:44363/Unauthorized',
            start_checksession: false,
            silent_renew: true,
            silent_renew_url: 'https://localhost:44363/silent-renew.html',
            post_login_route: '/dataeventrecords',
            forbidden_route: '/Forbidden',
            unauthorized_route: '/Unauthorized',
            log_console_warning_active: true,
            log_console_debug_active: true,
            max_id_token_iat_offset_allowed_in_seconds: 10
        };

        const authWellKnownEndpoints: AuthWellKnownEndpoints = {
            issuer: 'https://localhost:44363',
            jwks_uri: 'https://localhost:44363/.well-known/openid-configuration/jwks',
            authorization_endpoint: 'https://localhost:44363/connect/authorize',
            token_endpoint: 'https://localhost:44363/connect/token',
            userinfo_endpoint: 'https://localhost:44363/connect/userinfo',
            end_session_endpoint: 'https://localhost:44363/connect/endsession',
            check_session_iframe: 'https://localhost:44363/connect/checksession',
            revocation_endpoint: 'https://localhost:44363/connect/revocation',
            introspection_endpoint: 'https://localhost:44363/connect/introspect'
        };

        this.oidcSecurityService.setupModule(config, authWellKnownEndpoints);
    }
}

