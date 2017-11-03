import { Injectable } from '@angular/core';
import { CanActivate} from '@angular/router';
import { OidcSecurityService } from '../auth/services/oidc.security.service';
import { Subscription } from 'rxjs/Subscription';

@Injectable()
export class HasAdminRoleAuthenticationGuard implements CanActivate {

    private hasUserAdminRole = false;
    private isAuthorizedSubscription: Subscription;
    private isAuthorized: boolean;

    private userDataSubscription: Subscription;

    constructor(
        private oidcSecurityService: OidcSecurityService
    ) { }

    canActivate(): boolean {
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