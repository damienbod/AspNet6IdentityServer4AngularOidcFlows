import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'unauthorized',
    template: require('./unauthorized.component.html')
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
