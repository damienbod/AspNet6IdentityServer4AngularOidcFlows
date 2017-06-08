import { Injectable } from '@angular/core';
import { CanLoad, Route } from '@angular/router';

import { OidcSecurityUserService } from '../auth/services/oidc.security.user-service';
import { OidcSecurityService } from '../auth/services/oidc.security.service';

@Injectable()
export class HasAdminRoleCanLoadGuard implements CanLoad {

    private hasUserAdminRole = false;

    constructor(
        private securityService: OidcSecurityService,
        private oidcSecurityUserService: OidcSecurityUserService
    ) {
    }

    canLoad(route: Route): boolean {

        let userData = this.oidcSecurityUserService.userData;

        for (let i = 0; i < userData.role.length; i++) {
            if (userData.role[i] === 'admin') {
                console.log('user is admin');
            }
        }

        return this.hasUserAdminRole && this.securityService.isAuthorized;
    }
}