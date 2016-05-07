import { Component, OnInit } from '@angular/core';
import { CORE_DIRECTIVES } from '@angular/common';

@Component({
    selector: 'unauthorized',
    templateUrl: 'app/unauthorized/unauthorized.component.html',
    directives: [CORE_DIRECTIVES]
})

export class UnauthorizedComponent implements OnInit {

    public message: string;
    public values: any[];

    constructor() {
        this.message = "UnauthorizedComponent constructor";
    }
    
    ngOnInit() {
        
    }
}
