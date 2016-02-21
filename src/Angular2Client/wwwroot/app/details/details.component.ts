import { Component, OnInit } from 'angular2/core';
import { CORE_DIRECTIVES } from 'angular2/common';
import { DataEventRecordsService } from '../services/DataEventRecordsService';

@Component({
    selector: 'details',
    templateUrl: 'app/details/details.component.html',
    directives: [CORE_DIRECTIVES],
    providers: [DataEventRecordsService]
})

export class DetailsComponent implements OnInit {

    public message: string;
    public values: any[];

    constructor(private _dataEventRecordsService: DataEventRecordsService) {
        this.message = "DetailsComponent constructor";
    }
    
    ngOnInit() {
        this._dataEventRecordsService
        .GetAll()
        .subscribe((data:any[]) => this.values = data,
                error => console.log(error),
                () => console.log('Get all complete'));
    }
}
