import { Component, OnInit } from '@angular/core';
import { CORE_DIRECTIVES } from '@angular/common';

@Component({
    selector: 'forbidden',
    templateUrl: 'app/home/home.component.html',
    directives: [CORE_DIRECTIVES]
})

export class HomeComponent implements OnInit {

    public message: string;
    public values: any[];

    constructor() {
        this.message = "HomeComponent constructor";
    }
    
    ngOnInit() {
        
    }
}
