import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'home',
    templateUrl: 'home.component.html'
})

export class HomeComponent implements OnInit {

    public message: string;
    public values: any[];

    constructor() {
        this.message = 'HomeComponent constructor';
    }

    ngOnInit() {
    }
}
