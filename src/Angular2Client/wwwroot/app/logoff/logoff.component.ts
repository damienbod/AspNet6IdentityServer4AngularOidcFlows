import { Component, OnInit } from 'angular2/core';
import { CORE_DIRECTIVES } from 'angular2/common';
import { SecurityService } from '../services/SecurityService';

@Component({
    selector: 'logoff',
    templateUrl: 'app/logoff/logoff.component.html',
    directives: [CORE_DIRECTIVES],
    providers: [SecurityService]
})

export class LogoffComponent implements OnInit {

    public message: string;

    constructor(private _securityService: SecurityService) {
        this.message = "LogoffComponent constructor";
    }
    
    ngOnInit() {
        this._securityService.Logoff();
    }
}
