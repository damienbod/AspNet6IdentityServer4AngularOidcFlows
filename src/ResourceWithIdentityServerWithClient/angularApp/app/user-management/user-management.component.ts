import { Component, OnInit } from '@angular/core';
import { OidcSecurityService } from '../auth/services/oidc.security.service';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

import { UserManagementService } from '../user-management/UserManagementService';
import { User } from './models/User';

@Component({
    selector: 'user-management',
    templateUrl: 'user-management.component.html'
})

export class UserManagementComponent implements OnInit {

    public message: string;
    public Users: User[];

    constructor(
        private _userManagementService: UserManagementService,
        public securityService: OidcSecurityService,
        private _router: Router) {
        this.message = 'user-management';
    }

    ngOnInit() {
        this.getData();
    }

    private getData() {
        this._userManagementService
            .GetAll()
            .subscribe(data => this.Users = data,
            error => this.securityService.handleError(error),
            () => console.log('User Management Get all completed'));
    }

    public Update(user: User) {
        this._userManagementService.Update(user.id, user)
            .subscribe((() => console.log('subscribed')),
            error => this.securityService.handleError(error),
            () => console.log('update request sent!'));
    }

}
