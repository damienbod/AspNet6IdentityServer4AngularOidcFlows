import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { OidcSecurityService } from '../auth/angular-auth-oidc-client';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable()
export class HasAdminRoleAuthenticationGuard implements CanActivate {

    constructor(private oidcSecurityService: OidcSecurityService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        console.log(route + '' + state);

        return this.oidcSecurityService.userData$.pipe(
            switchMap((userData) => {
            if (userData) {
                for (let i = 0; i < userData.role.length; i++) {
                    if (userData.role[i] === 'admin') {
                        return of(true);
                    }
                }
            }

            return of(false);
            }));
    }
}
