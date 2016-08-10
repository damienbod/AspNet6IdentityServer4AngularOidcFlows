import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';
//import { FormsModule }    from '@angular/forms';

import { dataEventRecordsRouting } from './dataeventrecords.routes';

import { DataEventRecordsCreateComponent } from './dataeventrecords-create.component';
import { DataEventRecordsEditComponent } from './dataeventrecords-edit.component';
import { DataEventRecordsListComponent } from './dataeventrecords-list.component';
import { DataEventRecordsService } from './DataEventRecordsService';


@NgModule({
    declarations: [
        DataEventRecordsCreateComponent,
        DataEventRecordsEditComponent,
        DataEventRecordsListComponent
    ],
    imports: [
        CommonModule,
  //      FormsModule,
        dataEventRecordsRouting
    ],
    providers: [
        DataEventRecordsService
    ]
})

export class DataEventRecordsModule { }