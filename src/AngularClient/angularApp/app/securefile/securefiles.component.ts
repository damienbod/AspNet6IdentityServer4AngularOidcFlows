import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { SecureFileService } from './SecureFileService';
import { OidcSecurityService } from '../auth/services/oidc.security.service';
import { Observable }       from 'rxjs/Observable';

@Component({
    selector: 'securefiles',
    templateUrl: 'securefiles.component.html',
    providers: [SecureFileService]
})

export class SecureFilesComponent implements OnInit, OnDestroy {

    public message: string;
    public Files: string[];
    isAuthorizedSubscription: Subscription;
    isAuthorized: boolean;

    constructor(private _secureFileService: SecureFileService, public oidcSecurityService: OidcSecurityService) {
        this.message = 'Secure Files download';
    }

    ngOnInit() {
        this.isAuthorizedSubscription = this.oidcSecurityService.getIsAuthorized().subscribe(
            (isAuthorized: boolean) => {
                this.isAuthorized = isAuthorized;

                if (isAuthorized) {
                    this.getData();
                }
            });
    }

    ngOnDestroy(): void {
        this.isAuthorizedSubscription.unsubscribe();
    }

    public DownloadFileById(id: any) {
        this._secureFileService.DownloadFile(id);
    }

    private getData() {
        this._secureFileService.GetListOfFiles()
            .subscribe(data => this.Files = data,
            error => this.oidcSecurityService.handleError(error),
            () => console.log('getData for secure files, get all completed'));
    }
}
