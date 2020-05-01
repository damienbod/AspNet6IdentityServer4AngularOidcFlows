import { NgModule, APP_INITIALIZER } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { Configuration } from './app.constants';
import { routing } from './app.routes';

import { HttpClient, HttpClientModule } from '@angular/common/http';

import { ForbiddenComponent } from './forbidden/forbidden.component';
import { HomeComponent } from './home/home.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { UserManagementService } from './user-management/UserManagementService';
import { DataEventRecordsModule } from './dataeventrecords/dataeventrecords.module';
import { NavigationComponent } from './navigation/navigation.component';
import { AuthModule, OidcConfigService } from './auth/angular-auth-oidc-client';
import { AuthorizationGuard } from './authorization.guard';
import { HasAdminRoleAuthenticationGuard } from './guards/hasAdminRoleAuthenticationGuard';

export function configureAuth(oidcConfigService: OidcConfigService) {
    return () =>
        oidcConfigService.withConfig({
            stsServer: 'https://localhost:44363',
            redirectUrl: 'https://localhost:44363',
            clientId: 'singleapp',
            responseType: 'id_token token',
            scope: 'dataEventRecords openid',
            postLogoutRedirectUri: 'https://localhost:44363/Unauthorized',
            startCheckSession: false,
            silentRenew: true,
            silentRenewUrl: 'https://localhost:44363/silent-renew.html',
            postLoginRoute: '/dataeventrecords',
            forbiddenRoute: '/Forbidden',
            unauthorizedRoute: '/Unauthorized',
            logLevel: 0, // LogLevel.Debug, 
            // autoUserinfo: false,
        });
}

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
        OidcConfigService,
        {
            provide: APP_INITIALIZER,
            useFactory: configureAuth,
            deps: [OidcConfigService, HttpClient],
            multi: true,
        },
        AuthorizationGuard,
        Configuration,
        UserManagementService,
        Configuration,
        HasAdminRoleAuthenticationGuard
    ],
    bootstrap: [AppComponent],
})

export class AppModule {}