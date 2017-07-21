import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { OidcSecurityService } from '../auth/services/oidc.security.service';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

@Injectable()
export class HasAdminRoleAuthenticationGuard implements CanActivate {

    private hasUserAdminRole = false;

    constructor(
        private router: Router,
        private oidcSecurityService: OidcSecurityService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

        //let userData = this.securityService.getUserData();

        //for (let i = 0; i < userData.role.length; i++) {
        //    if (userData.role[i] === 'admin') {
        //        this.hasUserAdminRole = true;
        //    }
        //}

        return true; // this.securityService.isAuthorized && this.hasUserAdminRole;

    }
}