import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { Configuration } from '../app.constants';
import { Router } from '@angular/router';

@Injectable()
export class SecurityService {

    public IsAuthorized: boolean;
    public HasAdminRole: boolean;
    public UserData: any;

    private actionUrl: string;
    private headers: Headers;
    private storage: any;

    constructor(private _http: Http, private _configuration: Configuration, private _router: Router) {

        this.actionUrl = _configuration.Server + 'api/DataEventRecords/';

        this.headers = new Headers();
        this.headers.append('Content-Type', 'application/json');
        this.headers.append('Accept', 'application/json');
        this.storage = sessionStorage; //localStorage;

        if (this.retrieve('IsAuthorized') !== '') {
            this.HasAdminRole = this.retrieve('HasAdminRole');
            this.IsAuthorized = this.retrieve('IsAuthorized');
        }
    }

    public GetToken(): any {
        return this.retrieve('authorizationData');
    }

    public ResetAuthorizationData() {
        this.store('authorizationData', '');
        this.store('authorizationDataIdToken', '');

        this.IsAuthorized = false;
        this.HasAdminRole = false;
        this.store('HasAdminRole', false);
        this.store('IsAuthorized', false);
    }

    public SetAuthorizationData(token: any, id_token: any) {
        if (this.retrieve('authorizationData') !== '') {
            this.store('authorizationData', '');
        }

        this.store('authorizationData', token);
        this.store('authorizationDataIdToken', id_token);
        this.IsAuthorized = true;
        this.store('IsAuthorized', true);

        this.getUserData()
            .subscribe(data => this.UserData = data,
            error => this.HandleError(error),
            () => {
                for (let i = 0; i < this.UserData.role.length; i++) {
                    if (this.UserData.role[i] === 'dataEventRecords.admin') {
                        this.HasAdminRole = true;
                        this.store('HasAdminRole', true);
                    }
                }
            });

        // if the role was returned in the id_token, the roundtrip is not required
        //var data: any = this.getDataFromToken(id_token);
        //for (var i = 0; i < data.role.length; i++) {
        //    if (data.role[i] === 'dataEventRecords.admin') {
        //        this.HasAdminRole = true;
        //        this.store('HasAdminRole', true)
        //    }
        //}
    }

    public Authorize() {
        this.ResetAuthorizationData();

        console.log('BEGIN Authorize, no auth data');

        let authorizationUrl = 'https://localhost:44318/connect/authorize';
        let client_id = 'angular2client';
        let redirect_uri = 'https://localhost:44311';
        let response_type = 'id_token token';
        let scope = 'dataEventRecords securedFiles openid';
        let nonce = 'N' + Math.random() + '' + Date.now();
        let state = Date.now() + '' + Math.random();

        this.store('authStateControl', state);
        this.store('authNonce', nonce);
        console.log('AuthorizedController created. adding myautostate: ' + this.retrieve('authStateControl'));

        let url =
            authorizationUrl + '?' +
            'response_type=' + encodeURI(response_type) + '&' +
            'client_id=' + encodeURI(client_id) + '&' +
            'redirect_uri=' + encodeURI(redirect_uri) + '&' +
            'scope=' + encodeURI(scope) + '&' +
            'nonce=' + encodeURI(nonce) + '&' +
            'state=' + encodeURI(state);

        window.location.href = url;
    }

    public AuthorizedCallback() {
        console.log('BEGIN AuthorizedCallback, no auth data');
        this.ResetAuthorizationData();

        let hash = window.location.hash.substr(1);

        let result: any = hash.split('&').reduce(function(result : any, item: string) {
            let parts = item.split('=');
            result[parts[0]] = parts[1];
            return result;
        }, {});

        console.log(result);
        console.log('AuthorizedCallback created, begin token validation');

        let token = '';
        let id_token = '';
        let authResponseIsValid = false;
        if (!result.error) {

            if (result.state !== this.retrieve('authStateControl')) {
                console.log('AuthorizedCallback incorrect state');
            } else {

                token = result.access_token;
                id_token = result.id_token;

                let dataIdToken: any = this.getDataFromToken(id_token);
                console.log(dataIdToken);

                // validate nonce
                if (dataIdToken.nonce !== this.retrieve('authNonce')) {
                    console.log('AuthorizedCallback incorrect nonce');
                } else {
                    this.store('authNonce', '');
                    this.store('authStateControl', '');

                    authResponseIsValid = true;
                    console.log('AuthorizedCallback state and nonce validated, returning access token');
                }
            }
        }

        if (authResponseIsValid) {
            this.SetAuthorizationData(token, id_token);
            console.log(this.retrieve('authorizationData'));

            // router navigate to DataEventRecordsList
            this._router.navigate(['/dataeventrecords/list']);
        } else {
            this.ResetAuthorizationData();
            this._router.navigate(['/Unauthorized']);
        }
    }

    public Logoff() {
        // /connect/endsession?id_token_hint=...&post_logout_redirect_uri=https://myapp.com
        console.log('BEGIN Authorize, no auth data');

        let authorizationUrl = 'https://localhost:44318/connect/endsession';

        let id_token_hint = this.retrieve('authorizationDataIdToken');
        let post_logout_redirect_uri = 'https://localhost:44311/Unauthorized';

        let url =
            authorizationUrl + '?' +
            'id_token_hint=' + encodeURI(id_token_hint) + '&' +
            'post_logout_redirect_uri=' + encodeURI(post_logout_redirect_uri);

        this.ResetAuthorizationData();

        window.location.href = url;
    }

    public HandleError(error: any) {
        console.log(error);
        if (error.status == 403) {
            this._router.navigate(['/Forbidden']);
        } else if (error.status == 401) {
            this.ResetAuthorizationData();
            this._router.navigate(['/Unauthorized'])
        }
    }

    private urlBase64Decode(str: string) {
        let output = str.replace('-', '+').replace('_', '/');
        switch (output.length % 4) {
            case 0:
                break;
            case 2:
                output += '==';
                break;
            case 3:
                output += '=';
                break;
            default:
                throw 'Illegal base64url string!';
        }

        return window.atob(output);
    }

    private getDataFromToken(token: any) {
        let data = {};
        if (typeof token !== 'undefined') {
            let encoded = token.split('.')[1];
            data = JSON.parse(this.urlBase64Decode(encoded));
        }

        return data;
    }

    private retrieve(key: string): any {
        let item = this.storage.getItem(key);

        if (item && item !== 'undefined') {
            return JSON.parse(this.storage.getItem(key));
        }

        return;
    }

    private store(key: string, value: any) {
        this.storage.setItem(key, JSON.stringify(value));
    }

    private getUserData = (): Observable<string[]> => {
        this.setHeaders();
        return this._http.get('https://localhost:44318/connect/userinfo', {
            headers: this.headers,
            body: ''
        }).map(res => res.json());
    }

    private setHeaders() {
        this.headers = new Headers();
        this.headers.append('Content-Type', 'application/json');
        this.headers.append('Accept', 'application/json');

        let token = this.GetToken();

        if (token !== '') {
            this.headers.append('Authorization', 'Bearer ' + token);
        }
    }
}