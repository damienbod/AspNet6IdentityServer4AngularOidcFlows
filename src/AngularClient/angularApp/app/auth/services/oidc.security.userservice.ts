import { Injectable, EventEmitter, Output } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/interval';
import 'rxjs/add/observable/timer';
import { AuthConfiguration } from '../auth.configuration';

@Injectable()
export class OidcSecurityUserService {

    hasAdminRole: boolean;
    hasUserAdminRole: boolean;
    userData: any;

    private headers: Headers;

    constructor(private http: Http, private authConfiguration: AuthConfiguration) {
    }


    //private getUserData = (): Observable<string[]> => {
    //    this.setHeaders();
    //    return this.http.get(this.authConfiguration.userinfo_url, {
    //        headers: this.headers,
    //        body: ''
    //    }).map(res => res.json());
    //}

    //private setHeaders() {
    //    this.headers = new Headers();
    //    this.headers.append('Content-Type', 'application/json');
    //    this.headers.append('Accept', 'application/json');

    //    let token = this.getToken();

    //    if (token !== '') {
    //        this.headers.append('Authorization', 'Bearer ' + token);
    //    }
    //}
}