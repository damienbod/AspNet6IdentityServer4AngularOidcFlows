import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SecureFileService } from './SecureFileService';
import { OidcSecurityService } from '../auth/angular-auth-oidc-client';
import { map } from 'rxjs/operators';

@Component({
    selector: 'app-securefiles',
    templateUrl: 'securefiles.component.html',
    providers: [SecureFileService]
})

export class SecureFilesComponent implements OnInit {

    public message: string;
    public Files: string[] = [];
    isAuthenticated$: Observable<boolean>;

    constructor(private _secureFileService: SecureFileService, public oidcSecurityService: OidcSecurityService) {
        this.message = 'Secure Files download';
    }

    ngOnInit() {
        this.isAuthenticated$ = this.oidcSecurityService.isAuthenticated$;
        this.isAuthenticated$.pipe(
            map((isAuthorized: boolean) => {
                console.log('isAuthorized: ' + isAuthorized);

                if (isAuthorized) {
                    this.getData();
                }
            }));
    }

    DownloadFileById(id: any) {
        this._secureFileService.DownloadFile(id);
    }

    private getData() {
        this._secureFileService.GetListOfFiles()
            .subscribe(data => this.Files = data,
            () => console.log('getData for secure files, get all completed'));
    }
}
