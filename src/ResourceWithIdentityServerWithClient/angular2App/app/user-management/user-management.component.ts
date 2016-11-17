import { Component, OnInit } from '@angular/core';
import { SecurityService } from '../services/SecurityService';
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
        public securityService: SecurityService,
        private _router: Router) {
        this.message = "user-management";
    }
    
    ngOnInit() {
        this.getData();
    }

    private getData() {
        console.log('User Management:getData starting...');
        this._userManagementService
            .GetAll()
            .subscribe(data => this.Users = data,
            error => this.securityService.HandleError(error),
            () => console.log('User Management Get all completed'));
    }

}
