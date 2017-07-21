import { Injectable } from '@angular/core';
import { CanLoad, Route } from '@angular/router';

import { OidcSecurityService } from '../auth/services/oidc.security.service';

@Injectable()
export class HasAdminRoleCanLoadGuard implements CanLoad {

    private hasUserAdminRole = false;

    constructor(
        private oidcSecurityService: OidcSecurityService
    ) {
    }

    canLoad(route: Route): boolean {

        //let userData = this.securityService.getUserData();

        //for (let i = 0; i < userData.role.length; i++) {
        //    if (userData.role[i] === 'admin') {
        //        this.hasUserAdminRole = true;
        //    }
        //}

        return true; //this.hasUserAdminRole && this.securityService.isAuthorized;
    }
}