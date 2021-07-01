import { NgModule, APP_INITIALIZER } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { Configuration } from './app.constants';
import { routing } from './app.routes';

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SecureFileService } from './securefile/SecureFileService';

import { ForbiddenComponent } from './forbidden/forbidden.component';
import { HomeComponent } from './home/home.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { SecureFilesComponent } from './securefile/securefiles.component';
import { DataEventRecordsModule } from './dataeventrecords/dataeventrecords.module';

import { AuthModule, OidcConfigService, StsConfigHttpLoader, StsConfigLoader } from './auth/angular-auth-oidc-client';

import { L10nConfig, L10nLoader, TranslationModule, StorageStrategy, ProviderType } from 'angular-l10n';
import { AuthorizationGuard } from './authorization.guard';
import { map, switchMap } from 'rxjs/operators';

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

export const httpLoaderFactory = (httpClient: HttpClient) => {
    const config$ = httpClient
        .get<any>(`${window.location.origin}/api/ClientAppSettings`)
        .pipe(
            map((customConfig: any) => {
                return {
                    stsServer: customConfig.stsServer,
                    redirectUrl: customConfig.redirect_url,
                    clientId: customConfig.client_id,
                    responseType: customConfig.response_type,
                    scope: customConfig.scope,
                    postLogoutRedirectUri: customConfig.post_logout_redirect_uri,
                    startCheckSession: customConfig.start_checksession,
                    silentRenew: customConfig.silent_renew,
                    silentRenewUrl: customConfig.redirect_url + '/silent-renew.html',
                    postLoginRoute: customConfig.startup_route,
                    forbiddenRoute: customConfig.forbidden_route,
                    unauthorizedRoute: customConfig.unauthorized_route,
                    logLevel: 0, // LogLevel.logLevel or customConfig.logLevel
                    maxIdTokenIatOffsetAllowedInSeconds: customConfig.max_id_token_iat_offset_allowed_in_seconds,
                    historyCleanupOff: true,
                   // autoUserInfo: false,
                };
            })
        )
        .toPromise();

    return new StsConfigHttpLoader(config$);
};


@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        routing,
        HttpClientModule,
        TranslationModule.forRoot(l10nConfig),
        DataEventRecordsModule,
        AuthModule.forRoot({
            loader: {
                provide: StsConfigLoader,
                useFactory: httpLoaderFactory,
                deps: [HttpClient],
            },
        }),
    ],
    declarations: [
        AppComponent,
        ForbiddenComponent,
        HomeComponent,
        UnauthorizedComponent,
        SecureFilesComponent
    ],
    providers: [
        AuthorizationGuard,
        SecureFileService,
        Configuration
    ],
    bootstrap: [AppComponent],
})

export class AppModule {

    constructor(public l10nLoader: L10nLoader) {
        this.l10nLoader.load();

        console.log('APP STARTING');
    }
}
