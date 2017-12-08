import { Injectable } from '@angular/core';
import { CanLoad } from '@angular/router';

import { OidcSecurityService } from '../auth/services/oidc.security.service';

@Injectable()
export class HasAdminRoleCanLoadGuard implements CanLoad {

    private hasUserAdminRole = false;
    private isAuthorized: boolean;

    constructor(
        private oidcSecurityService: OidcSecurityService
    ) {
    }

    canLoad(): boolean {
        this.oidcSecurityService.getIsAuthorized().subscribe(
            (isAuthorized: boolean) => {
                this.isAuthorized = isAuthorized;
            });

        this.oidcSecurityService.getUserData().subscribe(
            (userData: any) => {

                if (userData && userData !== '') {
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
