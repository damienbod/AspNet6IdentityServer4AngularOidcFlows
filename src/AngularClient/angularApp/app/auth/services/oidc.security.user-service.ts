import { Injectable, EventEmitter, Output } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import { AuthConfiguration } from '../auth.configuration';
import { OidcSecurityCommon } from './oidc.security.common';

@Injectable()
export class OidcSecurityUserService {

    private userData: any;

    constructor(private http: Http, private authConfiguration: AuthConfiguration, private oidcSecurityCommon: OidcSecurityCommon) {

        if (this.oidcSecurityCommon.retrieve('userData') !== '') {
            this.userData = this.oidcSecurityCommon.retrieve('userData');
        }
    }

    initUserData() {
        this.getUserData()
            .subscribe(data => this.userData = data,
            error => this.handleError(error) );
    }

    getUserData = (): Observable<any> => {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');

        let token = this.oidcSecurityCommon.getToken();

        if (token !== '') {
            headers.append('Authorization', 'Bearer ' + token);
        }

        if (this.userData) {
            console.log(this.userData);
            return Observable.create((observer: Observer<any>) => {
                observer.next(this.userData);
                observer.complete();
            })
        }

        return this.http.get(this.authConfiguration.userinfo_url, {
            headers: headers,
            body: ''
        }).map(res => res.json());
    }

    // TODO refactor this to a common
    private handleError(error: any) {
        console.log(error);
    }
}