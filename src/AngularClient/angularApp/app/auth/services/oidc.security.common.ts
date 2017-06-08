import { Injectable } from '@angular/core';
import { AuthConfiguration } from '../auth.configuration';

@Injectable()
export class OidcSecurityCommon {

    private storage: any;

    storage_access_token = 'authorizationData';
    storage_id_token = 'authorizationDataIdToken';
    storage_isAuthorized = '_isAuthorized';
    storage_userData = 'userData';
    storage_authNonce = 'authNonce';
    storage_authStateControl = 'authStateControl';

    constructor(private authConfiguration: AuthConfiguration) {
        this.storage = sessionStorage; //localStorage;
    }

    retrieve(key: string): any {
        let item = this.storage.getItem(key);

        if (item && item !== 'undefined') {
            return JSON.parse(this.storage.getItem(key));
        }

        return;
    }

    store(key: string, value: any) {
        this.storage.setItem(key, JSON.stringify(value));
    }

    //handleError(error: any) {
    //    console.log(error);
    //    if (error.status == 403) {
    //        this._router.navigate(['/Forbidden']);
    //    } else if (error.status == 401) {
    //        this.resetAuthorizationData();
    //        this._router.navigate(['/Unauthorized']);
    //    }
    //}

    resetStorageData() {
        this.store(this.storage_access_token, '');
        this.store(this.storage_id_token, '');
        this.store(this.storage_isAuthorized, false);
        this.store(this.storage_userData, '');
    }

    getAccessToken(): any {
        return this.retrieve(this.storage_access_token);
    }
}