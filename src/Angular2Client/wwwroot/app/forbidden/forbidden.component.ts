import { Component, OnInit } from 'angular2/core';
import { CORE_DIRECTIVES } from 'angular2/common';

@Component({
    selector: 'forbidden',
    templateUrl: 'app/forbidden/forbidden.component.html',
    directives: [CORE_DIRECTIVES]
})

export class ForbiddenComponent implements OnInit {

    public message: string;
    public values: any[];

    constructor() {
        this.message = "ForbiddenComponent constructor";
    }
    
    ngOnInit() {
        
    }
}
