import { Injectable, EventEmitter, Output } from '@angular/core';

import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/interval';
import 'rxjs/add/observable/timer';
import { AuthConfiguration } from '../auth.configuration';

// http://openid.net/specs/openid-connect-session-1_0-ID4.html

@Injectable()
export class OidcSecuritySilentRenew {

    private expiresIn: number;
    private authorizationTime: number;
    private renewInSeconds = 30;

    private _sessionIframe: any;
    private _iframeMessageEvent: any;

    constructor(private _configuration: AuthConfiguration) {
    }

    public renewSession(url: string) {
        this._sessionIframe = window.document.createElement('iframe');
        console.log(this._sessionIframe);
        this._sessionIframe.style.display = 'none';
        this._sessionIframe.src = url;

        window.document.body.appendChild(this._sessionIframe);
        this._iframeMessageEvent = this._messageHandler.bind(this);
        window.addEventListener('message', this._iframeMessageEvent, false);

        return new Promise((resolve) => {
            this._sessionIframe.onload = () => {
                resolve();
            }
        });
    }

 
    private _messageHandler(e: any) {
        
    }
}