import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'user-management',
    templateUrl: 'user-management.component.html'
})

export class UserManagementComponent implements OnInit {

    public message: string;
    public values: any[];

    constructor() {
        this.message = "UserManagementComponent constructor";
    }
    
    ngOnInit() {
        
    }
}
