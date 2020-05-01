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

import { AuthModule, OidcConfigService } from './auth/angular-auth-oidc-client';

import { L10nConfig, L10nLoader, TranslationModule, StorageStrategy, ProviderType } from 'angular-l10n';
import { AuthorizationGuard } from './authorization.guard';

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

export function configureAuth(oidcConfigService: OidcConfigService) {
    return () =>
        oidcConfigService.withConfig({
            stsServer: 'https://localhost:44318',
            redirectUrl: 'https://localhost:44372',
            clientId: 'angularclientidtokenonly',
            responseType: 'id_token',
            scope: 'openid profile email',
            postLogoutRedirectUri: 'https://localhost:44372/Unauthorized',
            startCheckSession: false,
            silentRenew: true,
            silentRenewUrl: 'https://localhost:44372/silent-renew.html',
            postLoginRoute: '/home',
            forbiddenRoute: '/Forbidden',
            unauthorizedRoute: '/Unauthorized',
            logLevel: 0, // LogLevel.Debug, 
            autoCleanStateAfterAuthentication: false
            // autoUserinfo: false,
        });
}

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        routing,
        HttpClientModule,
        TranslationModule.forRoot(l10nConfig),
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
        {
            provide: APP_INITIALIZER,
            useFactory: configureAuth,
            deps: [OidcConfigService, HttpClient],
            multi: true,
        },
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
