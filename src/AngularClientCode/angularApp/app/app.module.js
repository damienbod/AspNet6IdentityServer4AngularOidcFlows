var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
import { L10nLoader, TranslationModule, StorageStrategy, ProviderType } from 'angular-l10n';
import { AuthorizationGuard } from './authorization.guard';
import { AuthorizationCanGuard } from './authorization.can.guard';
import { OidcConfigService } from './auth/services/oidc.security.config.service';
import { AuthWellKnownEndpoints } from './auth/models/auth.well-known-endpoints';
var l10nConfig = {
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
export function loadConfig(oidcConfigService) {
    console.log('APP_INITIALIZER STARTING');
    return function () { return oidcConfigService.load(window.location.origin + "/api/ClientAppSettings"); };
}
var AppModule = (function () {
    function AppModule(oidcSecurityService, oidcConfigService, configuration, l10nLoader) {
        var _this = this;
        this.oidcSecurityService = oidcSecurityService;
        this.oidcConfigService = oidcConfigService;
        this.l10nLoader = l10nLoader;
        this.l10nLoader.load();
        this.oidcConfigService.onConfigurationLoaded.subscribe(function () {
            var openIDImplicitFlowConfiguration = new OpenIDImplicitFlowConfiguration();
            openIDImplicitFlowConfiguration.stsServer = _this.oidcConfigService.clientConfiguration.stsServer;
            openIDImplicitFlowConfiguration.redirect_url = _this.oidcConfigService.clientConfiguration.redirect_url;
            openIDImplicitFlowConfiguration.client_id = _this.oidcConfigService.clientConfiguration.client_id;
            openIDImplicitFlowConfiguration.response_type = _this.oidcConfigService.clientConfiguration.response_type;
            openIDImplicitFlowConfiguration.scope = _this.oidcConfigService.clientConfiguration.scope;
            openIDImplicitFlowConfiguration.post_logout_redirect_uri = _this.oidcConfigService.clientConfiguration.post_logout_redirect_uri;
            openIDImplicitFlowConfiguration.start_checksession = _this.oidcConfigService.clientConfiguration.start_checksession;
            openIDImplicitFlowConfiguration.silent_renew = _this.oidcConfigService.clientConfiguration.silent_renew;
            openIDImplicitFlowConfiguration.silent_renew_url = 'https://localhost:44311/silent-renew.html';
            openIDImplicitFlowConfiguration.post_login_route = _this.oidcConfigService.clientConfiguration.startup_route;
            openIDImplicitFlowConfiguration.forbidden_route = _this.oidcConfigService.clientConfiguration.forbidden_route;
            openIDImplicitFlowConfiguration.unauthorized_route = _this.oidcConfigService.clientConfiguration.unauthorized_route;
            openIDImplicitFlowConfiguration.log_console_warning_active = _this.oidcConfigService.clientConfiguration.log_console_warning_active;
            openIDImplicitFlowConfiguration.log_console_debug_active = _this.oidcConfigService.clientConfiguration.log_console_debug_active;
            openIDImplicitFlowConfiguration.max_id_token_iat_offset_allowed_in_seconds =
                _this.oidcConfigService.clientConfiguration.max_id_token_iat_offset_allowed_in_seconds;
            configuration.FileServer = _this.oidcConfigService.clientConfiguration.apiFileServer;
            configuration.Server = _this.oidcConfigService.clientConfiguration.apiServer;
            var authWellKnownEndpoints = new AuthWellKnownEndpoints();
            authWellKnownEndpoints.setWellKnownEndpoints(_this.oidcConfigService.wellKnownEndpoints);
            _this.oidcSecurityService.setupModule(openIDImplicitFlowConfiguration, authWellKnownEndpoints);
        });
        console.log('APP STARTING');
    }
    AppModule = __decorate([
        NgModule({
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
        }),
        __metadata("design:paramtypes", [OidcSecurityService,
            OidcConfigService,
            Configuration,
            L10nLoader])
    ], AppModule);
    return AppModule;
}());
export { AppModule };
//# sourceMappingURL=app.module.js.map