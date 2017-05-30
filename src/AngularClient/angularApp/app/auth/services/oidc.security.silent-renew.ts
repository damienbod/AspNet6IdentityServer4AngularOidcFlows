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
    private renewInSeconds = 30;

    private sessionIframe: any;
    private frame_origin: any;
    private _boundMessageEvent: any;

    public load() {
        this.sessionIframe = window.document.createElement('iframe');
        console.log(this.sessionIframe);
        this.sessionIframe.style.display = 'none';
        this.sessionIframe.src = 'https://localhost:44318/connect/checksession';

        window.document.body.appendChild(this.sessionIframe);
        this._boundMessageEvent = this._message.bind(this);
        window.addEventListener('message', this._boundMessageEvent, false);

        return new Promise((resolve) => {
            this.sessionIframe.onload = () => {
                resolve();
            }
        });
    }

    public start(session_state: any, clientId: any) {

        console.log('start begin iframe worker');
        let url = 'https://localhost:44318';
        ////let idx = url.indexOf('/', url.indexOf('//') + 2);
        ////this.frame_origin = url.substr(0, idx);
        console.log(this.sessionIframe);

        // tODO quick test
        this.sessionIframe.contentWindow.postMessage(clientId + ' ' + session_state, url);

    }

    _message(e: any) {
        console.log(e);
        //  if ( e.origin === this._frame_origin &&
        if (
            e.source === this.sessionIframe.contentWindow
        ) {
            if (e.data === 'error') {
                console.log('error message from check session op iframe');
                //this.stop();
            } else if (e.data === 'changed') {
                console.log('changed message from check session op iframe');
                //this.stop();
                // TODO do something with this changed event
                //this._callback();
            } else {
                console.log(e.data + ' message from check session op iframe');
            }
        }
    }
}