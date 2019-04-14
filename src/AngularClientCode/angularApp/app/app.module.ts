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

            const config = new OpenIDImplicitFlowConfiguration();
            config.stsServer = this.oidcConfigService.clientConfiguration.stsServer;
            config.redirect_url = this.oidcConfigService.clientConfiguration.redirect_url;
            config.client_id = this.oidcConfigService.clientConfiguration.client_id;
            config.response_type = this.oidcConfigService.clientConfiguration.response_type;
            config.scope = this.oidcConfigService.clientConfiguration.scope;
            config.post_logout_redirect_uri = this.oidcConfigService.clientConfiguration.post_logout_redirect_uri;
            config.start_checksession = this.oidcConfigService.clientConfiguration.start_checksession;
            config.silent_renew = this.oidcConfigService.clientConfiguration.silent_renew;
            config.silent_renew_url = this.oidcConfigService.clientConfiguration.redirect_url + '/silent-renew.html';
            config.post_login_route = this.oidcConfigService.clientConfiguration.startup_route;
            config.forbidden_route = this.oidcConfigService.clientConfiguration.forbidden_route;
            config.unauthorized_route = this.oidcConfigService.clientConfiguration.unauthorized_route;
            config.log_console_warning_active = this.oidcConfigService.clientConfiguration.log_console_warning_active;
            config.log_console_debug_active = this.oidcConfigService.clientConfiguration.log_console_debug_active;
            config.max_id_token_iat_offset_allowed_in_seconds =
                this.oidcConfigService.clientConfiguration.max_id_token_iat_offset_allowed_in_seconds;
            config.history_cleanup_off = true;
            // config.iss_validation_off = false;

            configuration.FileServer = this.oidcConfigService.clientConfiguration.apiFileServer;
            configuration.Server = this.oidcConfigService.clientConfiguration.apiServer;

            this.oidcSecurityService.setupModule(config, this.oidcConfigService.wellKnownEndpoints);

        });

        console.log('APP STARTING');
    }
}
