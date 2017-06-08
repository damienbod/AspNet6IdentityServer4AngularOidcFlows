import { Injectable } from '@angular/core';
import { AuthConfiguration } from '../auth.configuration';

@Injectable()
export class OidcSecurityCommon {

    private storage: any;

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
        this.store('authorizationData', '');
        this.store('authorizationDataIdToken', '');
        this.store('_isAuthorized', false);
        this.store('CheckSessionChanged', false);
        this.store('userData', '');
    }

    getToken(): any {
        return this.retrieve('authorizationData');
    }
}