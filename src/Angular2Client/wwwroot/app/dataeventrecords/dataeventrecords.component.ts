import { Component, OnInit } from '@angular/core';
import { CORE_DIRECTIVES } from '@angular/common';
import { SecurityService } from '../services/SecurityService';
import { Observable }       from 'rxjs/Observable';
import { RouteConfig, ROUTER_DIRECTIVES } from '@angular/router';

import { DataEventRecordsService } from '../dataeventrecords/DataEventRecordsService';
import { DataEventRecord } from './models/DataEventRecord';
import { DataEventRecordsListComponent } from '../dataeventrecords/dataeventrecords-list.component';
import { DataEventRecordsCreateComponent } from '../dataeventrecords/dataeventrecords-create.component';
import { DataEventRecordsEditComponent } from '../dataeventrecords/dataeventrecords-edit.component';

@Component({
    selector: 'dataeventrecords',
    templateUrl: 'app/dataeventrecords/dataeventrecords.component.html',
    directives: [CORE_DIRECTIVES, ROUTER_DIRECTIVES]
})

@RouteConfig([
        {
            path: '/',
            name: 'DataEventRecordsList',
            component: DataEventRecordsListComponent,
            useAsDefault: true
        },
        {
            path: '/create',
            name: 'DataEventRecordsCreate',
            component: DataEventRecordsCreateComponent
        },
        {
            path: '/edit/:id',
            name: 'DataEventRecordsEdit',
            component: DataEventRecordsEditComponent
        },
])

export class DataEventRecordsComponent { }
