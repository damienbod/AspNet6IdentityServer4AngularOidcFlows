import { OidcSecurityService } from './services/oidc.security.service';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthConfiguration } from './auth.configuration';

@NgModule({
    imports: [
        CommonModule
    ]
})

export class AuthModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: AuthModule,
            providers: [
                OidcSecurityService,
                AuthConfiguration
            ]
        };
    }
}