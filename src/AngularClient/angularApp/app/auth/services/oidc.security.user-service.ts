import { Injectable, EventEmitter, Output } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/observable/from';

import { AuthConfiguration } from '../auth.configuration';

@Injectable()
export class OidcSecurityUserService {

    userData: Observable<any>;

    // TODO refactor this to a common
    private storage: any;

    constructor(private http: Http, private authConfiguration: AuthConfiguration) {

        // TODO refactor this to a common
        this.storage = sessionStorage; //localStorage;

        if (this.retrieve('userData') !== '') {
            this.userData = this.retrieve('userData');
        }
    }

    initUserData(access_token: any) {
        this.getUserData(access_token)
            .subscribe(data => this.userData = data,
            error => this.handleError(error) );
    }

    private getUserData = (access_token: any): Observable<any> => {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');

        if (access_token !== '') {
            headers.append('Authorization', 'Bearer ' + access_token);
        }

        if (this.userData) {
            return Observable.from(this.userData);
        }

        return this.http.get(this.authConfiguration.userinfo_url, {
            headers: headers,
            body: ''
        }).map(res => res.json());
    }

    public resetUserData() {
        this.userData = null;
        this.store('userData', '');
    }

    // TODO refactor this to a common
    private handleError(error: any) {
        console.log(error);
    }

    // TODO refactor this to a common
    private store(key: string, value: any) {
        this.storage.setItem(key, JSON.stringify(value));
    }

    // TODO refactor this to a common
    private retrieve(key: string): any {
        let item = this.storage.getItem(key);

        if (item && item !== 'undefined') {
            return JSON.parse(this.storage.getItem(key));
        }

        return;
    }
}