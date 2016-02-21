import { Component, OnInit } from 'angular2/core';
import { CORE_DIRECTIVES } from 'angular2/common';
import { DataEventRecordsService } from '../services/DataEventRecordsService';

@Component({
    selector: 'create',
    templateUrl: 'app/create/create.component.html',
    directives: [CORE_DIRECTIVES],
    providers: [DataEventRecordsService]
})

export class CreateComponent implements OnInit {

    public message: string;
    public values: any[];

    constructor(private _dataEventRecordsService: DataEventRecordsService) {
        this.message = "CreateComponent constructor";
    }
    
    ngOnInit() {
        this._dataEventRecordsService
        .GetAll()
        .subscribe((data:any[]) => this.values = data,
                error => console.log(error),
                () => console.log('Get all complete'));
    }
}
