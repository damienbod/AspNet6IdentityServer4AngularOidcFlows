import { Injectable } from '@angular/core';

import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/interval';
import 'rxjs/add/observable/timer';

// http://openid.net/specs/openid-connect-session-1_0-ID4.html

@Injectable()
export class OidcSecuritySilentRenew {

    private expiresIn: number;
    private authorizationTime: number;
    private renewInSeconds: number = 30;

    private sessionIframe: any;
    private frame_origin: any;

    constructor() {

        this.sessionIframe = window.document.createElement('iframe');
        this.sessionIframe.style.display = 'none';
        window.document.body.appendChild(this.sessionIframe);

        this.sessionIframe.src = 'https://localhost:44318/connect/checksession';
    }

    start(session_state: any, clientId: any) {

        let url = 'https://localhost:44311';
        ////let idx = url.indexOf('/', url.indexOf('//') + 2);
        ////this.frame_origin = url.substr(0, idx);

        this.sessionIframe.contentWindow.postMessage(clientId + ' ' + session_state, 'https://localhost:44311');
    }
}