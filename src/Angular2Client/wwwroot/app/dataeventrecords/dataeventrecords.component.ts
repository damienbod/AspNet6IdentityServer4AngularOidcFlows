import { Component, OnInit } from '@angular/core';
import { CORE_DIRECTIVES } from '@angular/common';
import { SecurityService } from '../services/SecurityService';
import { Observable }       from 'rxjs/Observable';
import { ROUTER_DIRECTIVES } from '@angular/router';

import { DataEventRecordsService } from '../dataeventrecords/DataEventRecordsService';
import { DataEventRecord } from './models/DataEventRecord';

@Component({
    selector: 'dataeventrecords',
    templateUrl: 'app/dataeventrecords/dataeventrecords.component.html',
    directives: [CORE_DIRECTIVES, ROUTER_DIRECTIVES]
})

export class DataEventRecordsComponent { }
