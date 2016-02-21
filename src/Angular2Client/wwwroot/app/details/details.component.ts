import { Component, OnInit } from 'angular2/core';
import { CORE_DIRECTIVES } from 'angular2/common';
import { DataEventRecordsService } from '../services/DataEventRecordsService';
import { RouteParams, Router } from 'angular2/router';

@Component({
    selector: 'details',
    templateUrl: 'app/details/details.component.html',
    directives: [CORE_DIRECTIVES],
    providers: [DataEventRecordsService]
})

export class DetailsComponent implements OnInit {

    private id: any;
    public message: string;
    public DataEventRecord: any;

    constructor(private _dataEventRecordsService: DataEventRecordsService, private _routeParams: RouteParams) {
        this.message = "DetailsComponent constructor";
        this.id = this._routeParams.get('id');
    }
    
    ngOnInit() {
        this._dataEventRecordsService.GetById(this.id)
            .subscribe((data: any[]) => this.DataEventRecord = data,
                error => console.log(error),
                () => console.log('Get by Id complete'));
    }

    public Update() {
        this._dataEventRecordsService.Update(this.id, this.DataEventRecord)
            .subscribe((data: any) => this.DataEventRecord = data,
            error => console.log(error),
            () => console.log('Get by Id complete'));
    }
}
