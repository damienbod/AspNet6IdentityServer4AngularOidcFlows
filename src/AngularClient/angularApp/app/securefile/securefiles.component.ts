import { Component, OnInit } from '@angular/core';
import { SecureFileService } from './SecureFileService';
import { OidcSecurityService } from '../auth/services/oidc.security.service';
import { Observable }       from 'rxjs/Observable';

@Component({
    selector: 'securefiles',
    templateUrl: 'securefiles.component.html',
    providers: [SecureFileService]
})

export class SecureFilesComponent implements OnInit {

    public message: string;
    public Files: string[];

    constructor(private _secureFileService: SecureFileService, public securityService: OidcSecurityService) {
        this.message = 'Secure Files download';
    }

    ngOnInit() {
      this.getData();
    }

    public DownloadFileById(id: any) {
        this._secureFileService.DownloadFile(id);
    }

    private getData() {
        this._secureFileService.GetListOfFiles()
            .subscribe(data => this.Files = data,
            error => this.securityService.HandleError(error),
            () => console.log('Get all completed'));
    }
}
