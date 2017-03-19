import { Injectable } from '@angular/core';
import { CanLoad, Route } from '@angular/router';

import { OidcSecurityService } from '../auth/services/oidc.security.service';

@Injectable()
export class HasAdminRoleCanLoadGuard implements CanLoad {

    constructor(public securityService: OidcSecurityService) {
    }

    canLoad(route: Route): boolean {
        console.log('excuting canLoad!');
        return  this.securityService.HasUserAdminRole && this.securityService.IsAuthorized();
    }
}