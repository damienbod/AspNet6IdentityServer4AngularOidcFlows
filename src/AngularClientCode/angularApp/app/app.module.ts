import { NgModule, APP_INITIALIZER } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { Configuration } from './app.constants';
import { routing } from './app.routes';

import { HttpClientModule } from '@angular/common/http';

import { SecureFileService } from './securefile/SecureFileService';

import { ForbiddenComponent } from './forbidden/forbidden.component';
import { HomeComponent } from './home/home.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { SecureFilesComponent } from './securefile/securefiles.component';

import { AuthModule } from './auth/modules/auth.module';
import { OidcSecurityService } from './auth/services/oidc.security.service';
import { OpenIDImplicitFlowConfiguration } from './auth/modules/auth.configuration';

import { DataEventRecordsModule } from './dataeventrecords/dataeventrecords.module';

import { L10nConfig, L10nLoader, TranslationModule, StorageStrategy, ProviderType } from 'angular-l10n';
import { AuthorizationGuard } from './authorization.guard';
import { AuthorizationCanGuard } from './authorization.can.guard';

import { OidcConfigService } from './auth/services/oidc.security.config.service';
import { AuthWellKnownEndpoints } from './auth/models/auth.well-known-endpoints';

const l10nConfig: L10nConfig = {
    locale: {
        languages: [
            { code: 'en', dir: 'ltr' },
            { code: 'it', dir: 'ltr' },
            { code: 'fr', dir: 'ltr' },
            { code: 'de', dir: 'ltr' }
        ],
        language: 'en',
        storage: StorageStrategy.Cookie
    },
    translation: {
        providers: [
            { type: ProviderType.Static, prefix: './i18n/locale-' }
        ],
        caching: true,
        missingValue: 'No key'
    }
};

export function loadConfig(oidcConfigService: OidcConfigService) {
    console.log('APP_INITIALIZER STARTING');
    return () => oidcConfigService.load(`${window.location.origin}/api/ClientAppSettings`);
}

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        routing,
        HttpClientModule,
        TranslationModule.forRoot(l10nConfig),
        DataEventRecordsModule,
        AuthModule.forRoot(),
    ],
    declarations: [
        AppComponent,
        ForbiddenComponent,
        HomeComponent,
        UnauthorizedComponent,
        SecureFilesComponent
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
        OidcSecurityService,
        AuthorizationGuard,
        AuthorizationCanGuard,
        SecureFileService,
        Configuration
    ],
    bootstrap: [AppComponent],
})

export class AppModule {

    constructor(
        private oidcSecurityService: OidcSecurityService,
        private oidcConfigService: OidcConfigService,
        configuration: Configuration,
        public l10nLoader: L10nLoader
    ) {
        this.l10nLoader.load();

        this.oidcConfigService.onConfigurationLoaded.subscribe(() => {

            const openIDImplicitFlowConfiguration = new OpenIDImplicitFlowConfiguration();
            openIDImplicitFlowConfiguration.stsServer = this.oidcConfigService.clientConfiguration.stsServer;
            openIDImplicitFlowConfiguration.redirect_url = this.oidcConfigService.clientConfiguration.redirect_url;
            // The Client MUST validate that the aud (audience) Claim contains its client_id value registered at the Issuer
            // identified by the iss (issuer) Claim as an audience.
            // The ID Token MUST be rejected if the ID Token does not list the Client as a valid audience,
            // or if it contains additional audiences not trusted by the Client.
            openIDImplicitFlowConfiguration.client_id = this.oidcConfigService.clientConfiguration.client_id;
            openIDImplicitFlowConfiguration.response_type = this.oidcConfigService.clientConfiguration.response_type;
            openIDImplicitFlowConfiguration.scope = this.oidcConfigService.clientConfiguration.scope;
            openIDImplicitFlowConfiguration.post_logout_redirect_uri = this.oidcConfigService.clientConfiguration.post_logout_redirect_uri;
            openIDImplicitFlowConfiguration.start_checksession = this.oidcConfigService.clientConfiguration.start_checksession;

            openIDImplicitFlowConfiguration.silent_renew = this.oidcConfigService.clientConfiguration.silent_renew;
            openIDImplicitFlowConfiguration.silent_renew_url = 'https://localhost:44352/silent-renew.html';

            openIDImplicitFlowConfiguration.post_login_route = this.oidcConfigService.clientConfiguration.startup_route;
            // HTTP 403
            openIDImplicitFlowConfiguration.forbidden_route = this.oidcConfigService.clientConfiguration.forbidden_route;
            // HTTP 401
            openIDImplicitFlowConfiguration.unauthorized_route = this.oidcConfigService.clientConfiguration.unauthorized_route;
            openIDImplicitFlowConfiguration.log_console_warning_active = this.oidcConfigService.clientConfiguration.log_console_warning_active;
            openIDImplicitFlowConfiguration.log_console_debug_active = this.oidcConfigService.clientConfiguration.log_console_debug_active;
            // id_token C8: The iat Claim can be used to reject tokens that were issued too far away from the current time,
            // limiting the amount of time that nonces need to be stored to prevent attacks.The acceptable range is Client specific.
            openIDImplicitFlowConfiguration.max_id_token_iat_offset_allowed_in_seconds =
                this.oidcConfigService.clientConfiguration.max_id_token_iat_offset_allowed_in_seconds;

            // openIDImplicitFlowConfiguration.iss_validation_off = false;
            configuration.FileServer = this.oidcConfigService.clientConfiguration.apiFileServer;
            configuration.Server = this.oidcConfigService.clientConfiguration.apiServer;

            const authWellKnownEndpoints = new AuthWellKnownEndpoints();
            authWellKnownEndpoints.setWellKnownEndpoints(this.oidcConfigService.wellKnownEndpoints);

            this.oidcSecurityService.setupModule(openIDImplicitFlowConfiguration, authWellKnownEndpoints);

        });

        console.log('APP STARTING');
    }
}
