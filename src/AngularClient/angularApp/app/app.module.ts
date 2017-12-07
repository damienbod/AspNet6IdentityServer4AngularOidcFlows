import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { Configuration } from './app.constants';
import { routing } from './app.routes';

import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';

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
        OidcSecurityService,
        SecureFileService,
        Configuration
    ],
    bootstrap: [AppComponent],
})

export class AppModule {

    clientConfiguration: any;

    constructor(
        public oidcSecurityService: OidcSecurityService,
        private http: HttpClient,
        configuration: Configuration,
        public l10nLoader: L10nLoader
    ) {
        this.l10nLoader.load();

        console.log('APP STARTING');
        this.configClient().subscribe((config: any) => {
            this.clientConfiguration = config;

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

            configuration.FileServer = this.clientConfiguration.apiFileServer;
            configuration.Server = this.clientConfiguration.apiServer;

            this.oidcSecurityService.setupModule(openIDImplicitFlowConfiguration);

            // if you need custom parameters
            // this.oidcSecurityService.setCustomRequestParameters({ 'culture': 'fr-CH', 'ui-culture': 'fr-CH', 'ui_locales': 'fr-CH' });
        });
    }

    configClient() {

        console.log('window.location', window.location);
        console.log('window.location.href', window.location.href);
        console.log('window.location.origin', window.location.origin);
        console.log(`${window.location.origin}/api/ClientAppSettings`);

        return this.http.get(`${window.location.origin}/api/ClientAppSettings`);
    }
}
