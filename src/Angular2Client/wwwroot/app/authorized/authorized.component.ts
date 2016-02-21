import { Component, OnInit } from 'angular2/core';
import { CORE_DIRECTIVES } from 'angular2/common';
import { SecurityService } from '../services/SecurityService';

@Component({
    selector: 'authorized',
    templateUrl: 'app/authorized/authorized.component.html',
    directives: [CORE_DIRECTIVES],
    providers: [SecurityService]
})

export class AuthorizedComponent implements OnInit {

    public message: string;


    constructor(private _securityService: SecurityService) {
        this.message = "AuthorizedComponent constructor";
    }
    
    ngOnInit() {
        this._securityService.Authorize(); 
    }
}
