import { Injectable } from 'angular2/core';
import { Http, Response, Headers } from 'angular2/http';
import 'rxjs/add/operator/map'
import { Observable } from 'rxjs/Observable';
import { Configuration } from '../app.constants';
import {Router} from 'angular2/router';

@Injectable()
export class SecurityService {

    private actionUrl: string;
    private headers: Headers;
    private storage: any;

    constructor(private _http: Http, private _configuration: Configuration, private _router: Router) {

        this.actionUrl = _configuration.Server + 'api/DataEventRecords/';

        this.headers = new Headers();
        this.headers.append('Content-Type', 'application/json');
        this.headers.append('Accept', 'application/json');
        this.storage = localStorage;
    }

    public IsAuthorized: boolean = false;
    public HasAdminRole: boolean = false;

    public ResetAuthorizationData() {
        this.store("authorizationData", "");

        this.IsAuthorized = false;
        this.HasAdminRole = false;
    }

    public SetAuthorizationData(token: any) {
        if (this.retrieve("authorizationData") !== "") {
            this.store("authorizationData", "");
        }

        this.store("authorizationData", token);
        this.IsAuthorized = true;

        var data: any = this.getDataFromToken(token);
        for (var i = 0; i < data.role.length; i++) {
            if (data.role[i] === "dataEventRecords.admin") {
                this.HasAdminRole = true;
            }
        }
    }

    public Authorize() {
        this.ResetAuthorizationData();

        console.log("BEGIN Authorize, no auth data");

        //GET /authorize?
        //response_type=code%20id_token
        //&client_id=s6BhdRkqt3
        //&redirect_uri=https%3A%2F%2Fclient.example.org%2Fcb
        //&scope=openid%20profile%20email
        //&nonce=n-0S6_WzA2Mj
        //&state=af0ifjsldkj HTTP/1.1
        //              Host: server.example.com

        var authorizationUrl = 'https://localhost:44345/connect/authorize';
        var client_id = 'angular2client';
        var redirect_uri = 'https://localhost:44311/Authorized';
        var response_type = "id_token token";
        var scope = "dataEventRecords aReallyCoolScope openid";
        var nonce = Date.now() + "" + Math.random();
        var state = Date.now() + "" + Math.random();

   

        this.store("authStateControl", state);
        console.log("AuthorizedController created. adding myautostate: " + this.retrieve("authStateControl"));

        var url =
            authorizationUrl + "?" +
            "response_type=" + encodeURI(response_type) + "&" +
            "client_id=" + encodeURI(client_id) + "&" +
            "redirect_uri=" + encodeURI(redirect_uri) + "&" +
            "scope=" + encodeURI(scope) + "&" +
            "nonce=" + encodeURI(nonce) + "&" +
            "state=" + encodeURI(state);

        window.location.href = url;
    }

    public AuthorizedCallback() {
        console.log("BEGIN AuthorizedCallback, no auth data");
        this.ResetAuthorizationData();

        var hash = window.location.hash.substr(1);

        var result: any = hash.split('&').reduce(function (result, item) {
            var parts = item.split('=');
            result[parts[0]] = parts[1];
            return result;
        }, {});

        console.log(result);
        console.log("AuthorizedCallback created, begin token validation");

        var token = "";
        if (!result.error) {
            if (result.state !== this.retrieve("authStateControl")) {
                console.log("AuthorizedCallback created. no myautostate");
            } else {
                this.store("authStateControl", "");
                console.log("AuthorizedCallback created. returning access token");
                console.log(result);

                token = result.access_token;
                var data = this.getDataFromToken(token);
                console.log(data);
            }
        }

        this.SetAuthorizationData(token);
        console.log(this.retrieve("authorizationData"));

        alert("DAAA");
        this._router.navigate(['Overviewindex']);
    }

    public Logoff() {

    }

    private urlBase64Decode(str) {
        var output = str.replace('-', '+').replace('_', '/');
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

    private getDataFromToken(token) {
        var data = {};
        if (typeof token !== 'undefined') {
            var encoded = token.split('.')[1];
            data = JSON.parse(this.urlBase64Decode(encoded));
        }

        return data;
    }

    private retrieve(key: string): any {
        var item = this.storage.getItem(key);

        if (item && item !== 'undefined') {
            return JSON.parse(this.storage.getItem(key));
        }

        return;
    }

    private store(key: string, value: any) {
        this.storage.setItem(key, JSON.stringify(value));
    }

}