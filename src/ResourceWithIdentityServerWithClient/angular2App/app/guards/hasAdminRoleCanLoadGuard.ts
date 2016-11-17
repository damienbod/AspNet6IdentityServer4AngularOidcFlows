import { Injectable } from '@angular/core';
import { CanLoad, Route } from '@angular/router';

import { SecurityService } from '../services/SecurityService';

@Injectable()
export class HasAdminRoleCanLoadGuard implements CanLoad {

    constructor(public securityService: SecurityService) {
    }

    canLoad(route: Route): boolean {
        console.log("excuting canLoad!");
        return  this.securityService.HasUserAdminRole && this.securityService.IsAuthorized; 
    }
}