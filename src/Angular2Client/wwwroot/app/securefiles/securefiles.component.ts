import { Component, OnInit } from 'angular2/core';
import { CORE_DIRECTIVES } from 'angular2/common';
import { SecureFileService } from '../services/SecureFileService';
import { SecurityService } from '../services/SecurityService';
import { Observable }       from 'rxjs/Observable';
import { Router } from 'angular2/router';

@Component({
    selector: 'securefiles',
    templateUrl: 'app/securefiles/securefiles.component.html',
    directives: [CORE_DIRECTIVES],
    providers: [SecureFileService]
})

export class SecureFilesComponent implements OnInit {

    public message: string;
   
    constructor(private _secureFileService: SecureFileService, public securityService: SecurityService, private _router: Router) {
        this.message = "Secure Files download";
    }

    ngOnInit() {
      //  this.getData();
    }

    public GetFileById(id: any) {
        console.log("Try to delete" + id);
        this._secureFileService.GetFileUsingId(id)
            .subscribe((() => console.log("subscribed")),
            error => this.securityService.HandleError(error),
            () => console.log('Get File completed'));
    }

    //private getData() {
    //    this._secureFileService
    //        .GetAll()
    //        .subscribe(data => this.DataEventRecords = data,
    //        error => this.securityService.HandleError(error),
    //        () => console.log('Get all completed'));
    //}

}
