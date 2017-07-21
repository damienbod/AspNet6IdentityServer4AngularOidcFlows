import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription'
import { OidcSecurityService } from '../auth/services/oidc.security.service';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

import { UserManagementService } from '../user-management/UserManagementService';
import { User } from './models/User';

@Component({
    selector: 'user-management',
    templateUrl: 'user-management.component.html'
})

export class UserManagementComponent implements OnInit, OnDestroy {

    isAuthorizedSubscription: Subscription;
    isAuthorized: boolean;

    public message: string;
    public Users: User[];

    constructor(
        private _userManagementService: UserManagementService,
        public oidcSecurityService: OidcSecurityService,
        private _router: Router) {
        this.message = 'user-management';
    }

    ngOnInit() {
        this.isAuthorizedSubscription = this.oidcSecurityService.getIsAuthorized().subscribe(
            (isAuthorized: boolean) => {
                this.isAuthorized = isAuthorized;
                this.getData() 
            });
    }

    ngOnDestroy(): void {
        this.isAuthorizedSubscription.unsubscribe();
    }


    private getData() {
        this._userManagementService
            .GetAll()
            .subscribe(data => this.Users = data,
            error => this.oidcSecurityService.handleError(error),
            () => console.log('User Management Get all completed'));
    }

    public Update(user: User) {
        this._userManagementService.Update(user.id, user)
            .subscribe((() => console.log('subscribed')),
            error => this.oidcSecurityService.handleError(error),
            () => console.log('update request sent!'));
    }

}
