import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SecureFileService } from './SecureFileService';
import { OidcSecurityService } from '../auth/angular-auth-oidc-client';
import { switchMap } from 'rxjs/operators';

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
            switchMap((isAuthorized) => this.getData(isAuthorized))
        ).subscribe(data =>
            this.Files = data,
            () => console.log('getData for secure files, get all completed')
        );
    }

    DownloadFileById(id: any) {
        this._secureFileService.DownloadFile(id);
    }

    private getData(isAuthenticated: boolean): Observable<string[]> {
        if (isAuthenticated) {
            return this._secureFileService.GetListOfFiles();
        }
        return of(null);
    }
}
