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
import { DataEventRecordsModule } from './dataeventrecords/dataeventrecords.module';

import { AuthModule } from './auth/modules/auth.module';
import { OidcSecurityService } from './auth/services/oidc.security.service';
import { OidcConfigService, ConfigResult } from './auth/services/oidc.security.config.service';
import { OpenIdConfiguration } from './auth/models/auth.configuration';

import { L10nConfig, L10nLoader, TranslationModule, StorageStrategy, ProviderType } from 'angular-l10n';
import { AuthorizationGuard } from './authorization.guard';
import { AuthorizationCanGuard } from './authorization.can.guard';

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

        this.oidcConfigService.onConfigurationLoaded.subscribe((configResult: ConfigResult) => {

            const config: OpenIdConfiguration = {
                stsServer: configResult.customConfig.stsServer,
                redirect_url: configResult.customConfig.redirect_url,
                client_id: configResult.customConfig.client_id,
                response_type: configResult.customConfig.response_type,
                scope: configResult.customConfig.scope,
                post_logout_redirect_uri: configResult.customConfig.post_logout_redirect_uri,
                start_checksession: configResult.customConfig.start_checksession,
                silent_renew: configResult.customConfig.silent_renew,
                silent_renew_url: configResult.customConfig.redirect_url + '/silent-renew.html',
                post_login_route: configResult.customConfig.startup_route,
                forbidden_route: configResult.customConfig.forbidden_route,
                unauthorized_route: configResult.customConfig.unauthorized_route,
                log_console_warning_active: configResult.customConfig.log_console_warning_active,
                log_console_debug_active: configResult.customConfig.log_console_debug_active,
                max_id_token_iat_offset_allowed_in_seconds: configResult.customConfig.max_id_token_iat_offset_allowed_in_seconds,
                history_cleanup_off: true
                // iss_validation_off: false
                // disable_iat_offset_validation: true
            };

            configuration.FileServer = configResult.customConfig.apiFileServer;
            configuration.Server = configResult.customConfig.apiServer;

            this.oidcSecurityService.setupModule(config, configResult.authWellknownEndpoints);
        });

        console.log('APP STARTING');
    }
}
