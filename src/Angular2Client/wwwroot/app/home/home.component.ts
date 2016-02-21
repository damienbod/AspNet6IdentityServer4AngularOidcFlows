import { Component, OnInit } from 'angular2/core';
import { CORE_DIRECTIVES } from 'angular2/common';
import { DataService } from '../services/DataService';

@Component({
    selector: 'home',
    templateUrl: 'app/home/home.component.html',
    directives: [CORE_DIRECTIVES],
    providers:[DataService]
})

export class HomeComponent implements OnInit {

    public message: string;
    public values: any[];

    constructor(private _dataService : DataService) {
        this.message = "Hello from HomeComponent constructor";
    }
    
    ngOnInit() {
        this._dataService
        .GetAll()
        .subscribe((data:any[]) => this.values = data,
                error => console.log(error),
                () => console.log('Get all complete'));
    }
}
