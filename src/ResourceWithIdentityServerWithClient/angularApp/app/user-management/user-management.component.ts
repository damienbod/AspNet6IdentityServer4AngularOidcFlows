import { Component, OnInit } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { OidcSecurityService } from '../auth/angular-auth-oidc-client';

import { UserManagementService } from '../user-management/UserManagementService';
import { User } from './models/User';

@Component({
    selector: 'app-user-management',
    templateUrl: 'user-management.component.html'
})

export class UserManagementComponent implements OnInit {

    isAuthenticated$: Observable<boolean>;
    userData$: Observable<any>;
    message: string;
    Users: User[] = [];

    constructor(
        private _userManagementService: UserManagementService,
        public oidcSecurityService: OidcSecurityService,
    ) {
        this.message = 'user-management';
    }

    ngOnInit() {
        this.isAuthenticated$ = this.oidcSecurityService.isAuthenticated$;
        this.userData$ = this.oidcSecurityService.userData$;

        this.getIsAdmin().pipe(
            switchMap((isAdmin) => this.getData(isAdmin))
        ).subscribe(
            (data) => {
                this.Users = data;
                console.log('User Management Get all completed', data)
            }
        );
    }

    getIsAdmin(): Observable<boolean> {

        return this.oidcSecurityService.userData$.pipe(
            switchMap((userData: any) => {
                if (userData) {
                    for (let i = 0; i < userData.role.length; i++) {
                        if (userData.role[i] === 'admin') {
                            console.log('PROCESS ADMIN ', true);
                            return of(true);
                        }
                    }
                }

                return of(false);
            }));
    }

    private getData(isAdmin: boolean): Observable<User[]> {
        console.log('UM isAdmin', isAdmin);
        if (isAdmin) {
            return this._userManagementService.GetAll();
        }
        return of(null);
    }

    public Update(user: User) {
        this._userManagementService.Update(user.id, user)
            .subscribe((() => console.log('subscribed')),
            () => console.log('update request sent!'));
    }

}
