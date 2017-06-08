import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { OidcSecurityService } from '../auth/services/oidc.security.service';

@Injectable()
export class HasAdminRoleAuthenticationGuard implements CanActivate {

    constructor(private router: Router, public securityService: OidcSecurityService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        let url: string = state.url;

        return this.securityService.HasUserAdminRole && this.securityService.isAuthorized;
    }
}