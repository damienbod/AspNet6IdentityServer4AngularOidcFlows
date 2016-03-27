import { Component, OnInit } from 'angular2/core';
import { CORE_DIRECTIVES } from 'angular2/common';
import { DataEventRecordsService } from '../../services/DataEventRecordsService';
import { SecurityService } from '../../services/SecurityService';
import { Observable }       from 'rxjs/Observable';
import { RouteConfig, ROUTER_DIRECTIVES } from 'angular2/router';
import { DataEventRecord } from '../../models/DataEventRecord';

import {DataeventrecordsComponent} from '../../dataeventrecord/dataeventrecords/dataeventrecords.component';
import {DataeventrecordcreateComponent} from '../../dataeventrecord/dataeventrecordcreate/dataeventrecordcreate.component';
import {DataeventrecordeditComponent} from '../../dataeventrecord/dataeventrecordedit/dataeventrecordedit.component';

@Component({
    selector: 'dataeventrecord',
    templateUrl: 'app/dataeventrecord/dataeventrecord/dataeventrecord.component.html',
    directives: [CORE_DIRECTIVES, ROUTER_DIRECTIVES],
    providers: [DataEventRecordsService]
})

@RouteConfig([
    { path: '/', name: 'Dataeventrecords', component: DataeventrecordsComponent, useAsDefault: true },
    { path: '/create', name: 'Dataeventrecordcreate', component: DataeventrecordcreateComponent },
    { path: '/edit/:Id', name: 'Dataeventrecordedit', component: DataeventrecordeditComponent },
])


export class DataeventrecordComponent { }
