import { NgModule, ModuleWithProviders, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

import { OidcSecurityService } from './services/oidc.security.service';
import { AuthConfiguration } from './auth.configuration';
import { OidcSecurityValidation } from './services/oidc.security.validation';

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
                OidcSecurityValidation,
                AuthConfiguration
            ]
        };
    }
}