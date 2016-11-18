import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { SecurityService } from '../services/SecurityService';

@Injectable()
export class HasAdminRoleAuthenticationGuard implements CanActivate {

    constructor(private router: Router, public securityService: SecurityService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        let url: string = state.url;

        return this.securityService.HasUserAdminRole && this.securityService.IsAuthorized; 
    }
}