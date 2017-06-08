import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { OidcSecurityUserService } from '../auth/services/oidc.security.user-service';
import { OidcSecurityService } from '../auth/services/oidc.security.service';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

@Injectable()
export class HasAdminRoleAuthenticationGuard implements CanActivate {

    private hasUserAdminRole = false;

    constructor(
        private router: Router,
        private securityService: OidcSecurityService,
        private oidcSecurityUserService: OidcSecurityUserService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        let url: string = state.url;

        let userData = this.oidcSecurityUserService.userData;

        for (let i = 0; i < userData.role.length; i++) {
            if (userData.role[i] === 'admin') {
                console.log('user is admin');
            }
        }

        return this.securityService.isAuthorized && this.hasUserAdminRole;

    }

    //canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

    //    let url: string = state.url;

    //    return this.oidcSecurityUserService.getUserData().map(userData => {
    //        return this.securityService.isAuthorized && !!userData.role.filter(role => role === 'admin');
    //    });
    //}
}