import { Injectable } from '@angular/core';
import { CanLoad, Route } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { OidcSecurityService } from '../auth/services/oidc.security.service';

@Injectable()
export class HasAdminRoleCanLoadGuard implements CanLoad {

    private hasUserAdminRole = false;
    private isAuthorizedSubscription: Subscription;
    private isAuthorized: boolean;

    private userDataSubscription: Subscription;
    private userData: boolean;

    constructor(
        private oidcSecurityService: OidcSecurityService
    ) {
    }

    canLoad(route: Route): boolean {
        this.isAuthorizedSubscription = this.oidcSecurityService.getIsAuthorized().subscribe(
            (isAuthorized: boolean) => {
                this.isAuthorized = isAuthorized;
            });

        this.userDataSubscription = this.oidcSecurityService.getUserData().subscribe(
            (userData: any) => {

                if (userData && userData != '') {
                    for (let i = 0; i < userData.role.length; i++) {
                        if (userData.role[i] === 'admin') {
                            this.hasUserAdminRole = true;
                        }
                    }
                }
            });

        return this.hasUserAdminRole && this.isAuthorized;
    }
}