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
import { OidcConfigService, ConfigResult } from './auth/services/oidc.security.config.service';
import { OpenIdConfiguration } from './auth/models/auth.configuration';

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
        configuration: Configuration
    ) {

        this.oidcConfigService.onConfigurationLoaded.subscribe((configResult: ConfigResult) => {

            const flowType = 'id_token';

            // const flowType = 'id_token token';

            const config: OpenIdConfiguration = {
                // auto_userinfo: false,

                stsServer: 'https://localhost:44318',
                redirect_url: 'https://localhost:44372',
                client_id: 'angularclientidtokenonly',
                response_type: flowType,
                scope: 'openid profile email',
                post_logout_redirect_uri: 'https://localhost:44372/Unauthorized',
                start_checksession: false,
                silent_renew: true,
                silent_renew_url: 'https://localhost:44372/silent-renew.html',
                post_login_route: '/home',
                forbidden_route: '/Forbidden',
                unauthorized_route: '/Unauthorized',
                log_console_warning_active: true,
                log_console_debug_active: false,
                max_id_token_iat_offset_allowed_in_seconds: 3,
                auto_clean_state_after_authentication: false
            };

            configuration.FileServer = configResult.customConfig.apiFileServer;
            configuration.Server = configResult.customConfig.apiServer;

            this.oidcSecurityService.setupModule(config, configResult.authWellknownEndpoints);
        });
    }
}
