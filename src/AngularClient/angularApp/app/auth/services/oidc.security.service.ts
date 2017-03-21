import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Rx';
import { Router } from '@angular/router';
import { AuthConfiguration } from '../auth.configuration';
import { OidcSecurityValidation } from './oidc.security.validation';
import { JwtKeys } from './jwtkeys';

@Injectable()
export class OidcSecurityService {

    public HasAdminRole: boolean;
    public HasUserAdminRole: boolean;
    public UserData: any;

    private _isAuthorized: boolean;
    private actionUrl: string;
    private headers: Headers;
    private storage: any;
    private oidcSecurityValidation: OidcSecurityValidation;

    private errorMessage: string;
    private jwtKeys: JwtKeys;

    constructor(private _http: Http, private _configuration: AuthConfiguration, private _router: Router) {

        this.actionUrl = _configuration.server + 'api/DataEventRecords/';
        this.oidcSecurityValidation = new OidcSecurityValidation();

        this.headers = new Headers();
        this.headers.append('Content-Type', 'application/json');
        this.headers.append('Accept', 'application/json');
        this.storage = sessionStorage; //localStorage;

        if (this.retrieve('_isAuthorized') !== '') {
            this.HasAdminRole = this.retrieve('HasAdminRole');
            this._isAuthorized = this.retrieve('_isAuthorized');
        }
    }

    public IsAuthorized(): boolean {
        if (this._isAuthorized) {
            if (this.oidcSecurityValidation.IsTokenExpired(this.retrieve('authorizationDataIdToken'))) {
                console.log('IsAuthorized: isTokenExpired');
                this.ResetAuthorizationData();
                return false;
            }

            return true;
        }

        return false;
    }

    public GetToken(): any {
        return this.retrieve('authorizationData');
    }

    public ResetAuthorizationData() {
        this.store('authorizationData', '');
        this.store('authorizationDataIdToken', '');

        this._isAuthorized = false;
        this.HasAdminRole = false;
        this.store('HasAdminRole', false);
        this.store('_isAuthorized', false);
    }

    public SetAuthorizationData(token: any, id_token: any) {
        if (this.retrieve('authorizationData') !== '') {
            this.store('authorizationData', '');
        }

        console.log(token);
        console.log(id_token);
        console.log('storing to storage, getting the roles');
        this.store('authorizationData', token);
        this.store('authorizationDataIdToken', id_token);
        this._isAuthorized = true;
        this.store('_isAuthorized', true);

        this.getUserData()
            .subscribe(data => this.UserData = data,
            error => this.HandleError(error),
            () => {
                for (let i = 0; i < this.UserData.role.length; i++) {
                    if (this.UserData.role[i] === 'dataEventRecords.admin') {
                        this.HasAdminRole = true;
                        this.store('HasAdminRole', true);
                    }
                    if (this.UserData.role[i] === 'admin') {
                        this.HasUserAdminRole = true;
                        this.store('HasUserAdminRole', true);
                    }
                }
            });
    }

    public Authorize() {
        this.ResetAuthorizationData();

        console.log('BEGIN Authorize, no auth data');

        let authorizationUrl = this._configuration.server + '/connect/authorize';
        let client_id = this._configuration.client_id;
        let redirect_uri = this._configuration.redirect_url;
        let response_type = this._configuration.response_type;
        let scope = this._configuration.scope;
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

        let result: any = hash.split('&').reduce(function (result: any, item: string) {
            let parts = item.split('=');
            result[parts[0]] = parts[1];
            return result;
        }, {});

        console.log(result);
        console.log('AuthorizedCallback created, begin token validation');

        let token = '';
        let id_token = '';
        let authResponseIsValid = false;

        this.getSigningKeys()
            .subscribe(jwtKeys => {
                this.jwtKeys = jwtKeys;

                if (!result.error) {

                    // validate state
                    if (this.oidcSecurityValidation.ValidateStateFromHashCallback(result.state, this.retrieve('authStateControl'))) {
                        token = result.access_token;
                        id_token = result.id_token;
                        let decoded: any;
                        let headerDecoded;
                        decoded = this.oidcSecurityValidation.GetPayloadFromToken(id_token, false);
                        headerDecoded = this.oidcSecurityValidation.GetHeaderFromToken(id_token, false);

                        // validate jwt signature
                        if (this.oidcSecurityValidation.Validate_signature_id_token(id_token, this.jwtKeys)) {
                            // validate nonce
                            if (this.oidcSecurityValidation.Validate_id_token_nonce(decoded, this.retrieve('authNonce'))) {
                                // validate iss
                                if (this.oidcSecurityValidation.Validate_id_token_iss(decoded, this._configuration.iss)) {
                                    // validate aud
                                    if (this.oidcSecurityValidation.Validate_id_token_aud(decoded, this._configuration.client_id)) {
                                        // valiadate at_hash and access_token
                                        if (this.oidcSecurityValidation.Validate_id_token_at_hash(token, decoded.at_hash) || !token) {
                                            this.store('authNonce', '');
                                            this.store('authStateControl', '');

                                            authResponseIsValid = true;
                                            console.log('AuthorizedCallback state, nonce, iss, aud, signature validated, returning token');
                                        } else {
                                            console.log('AuthorizedCallback incorrect aud');
                                        }
                                    } else {
                                        console.log('AuthorizedCallback incorrect aud');
                                    }
                                } else {
                                    console.log('AuthorizedCallback incorrect iss');
                                }
                            } else {
                                console.log('AuthorizedCallback incorrect nonce');
                            }
                        } else {
                            console.log('AuthorizedCallback incorrect Signature id_token');
                        }
                    } else {
                        console.log('AuthorizedCallback incorrect state');
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
            });
    }

    public Logoff() {
        // /connect/endsession?id_token_hint=...&post_logout_redirect_uri=https://myapp.com
        console.log('BEGIN Authorize, no auth data');

        let authorizationEndsessionUrl = this._configuration.server + '/connect/endsession';

        let id_token_hint = this.retrieve('authorizationDataIdToken');
        let post_logout_redirect_uri = this._configuration.post_logout_redirect_uri;

        let url =
            authorizationEndsessionUrl + '?' +
            'id_token_hint=' + encodeURI(id_token_hint) + '&' +
            'post_logout_redirect_uri=' + encodeURI(post_logout_redirect_uri);

        this.ResetAuthorizationData();

        window.location.href = url;
    }

    private runGetSigningKeys() {
        this.getSigningKeys()
            .subscribe(
            jwtKeys => this.jwtKeys = jwtKeys,
            error => this.errorMessage = <any>error);
    }

    private getSigningKeys(): Observable<JwtKeys> {
        return this._http.get(this._configuration.jwks_url)
            .map(this.extractData)
            .catch(this.handleError);
    }

    private extractData(res: Response) {
        let body = res.json();
        return body;
    }

    private handleError(error: Response | any) {
        // In a real world app, you might use a remote logging infrastructure
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Observable.throw(errMsg);
    }

    public HandleError(error: any) {
        console.log(error);
        if (error.status == 403) {
            this._router.navigate(['/Forbidden']);
        } else if (error.status == 401) {
            this.ResetAuthorizationData();
            this._router.navigate(['/Unauthorized']);
        }
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
        return this._http.get(this._configuration.server + '/connect/userinfo', {
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