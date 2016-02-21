import { Component, OnInit } from 'angular2/core';
import { CORE_DIRECTIVES } from 'angular2/common';
import { SecurityService } from '../services/SecurityService';

@Component({
    selector: 'authorize',
    templateUrl: 'app/authorize/authorize.component.html',
    directives: [CORE_DIRECTIVES],
    providers: [SecurityService]
})

export class AuthorizeComponent implements OnInit {

    public message: string;


    constructor(private _securityService: SecurityService) {
        this.message = "AuthorizeComponent constructor";
    }
    
    ngOnInit() {
        this._securityService.Authorize(); 
    }
}
