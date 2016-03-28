import { Component, OnInit } from 'angular2/core';
import { CORE_DIRECTIVES } from 'angular2/common';
import { SecurityService } from '../services/SecurityService';
import { Observable }       from 'rxjs/Observable';
import { RouteConfig, ROUTER_DIRECTIVES } from 'angular2/router';

import { DataEventRecordsService } from '../dataeventrecord/DataEventRecordsService';
import { DataEventRecord } from './models/DataEventRecord';
import {DataEventRecordsComponent} from '../dataeventrecord/dataeventrecords.component';
import {DataEventRecordCreateComponent} from '../dataeventrecord/dataeventrecord-create.component';
import {DataEventRecordEditComponent} from '../dataeventrecord/dataeventrecord-edit.component';

@Component({
    selector: 'dataeventrecord',
    templateUrl: 'app/dataeventrecord/dataeventrecord/dataeventrecord.component.html',
    directives: [CORE_DIRECTIVES, ROUTER_DIRECTIVES],
    providers: [DataEventRecordsService]
})

@RouteConfig([
        { path: '/', name: 'DataEventRecords', component: DataEventRecordsComponent, useAsDefault: true },
        { path: '/create', name: 'DataEventRecordCreate', component: DataEventRecordCreateComponent },
        { path: '/edit/:Id', name: 'DataEventRecordEdit', component: DataEventRecordEditComponent },
])


export class DataEventRecordComponent { }
