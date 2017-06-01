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
export class OidcSecurityCheckSession {

    private expiresIn: number;
    private authorizationTime: number;
    private renewInSeconds = 30;

    private _sessionIframe: any;
    private _iframeMessageEvent: any;

    @Output() public onCheckSessionChanged: EventEmitter<any> = new EventEmitter<any>(true);

    constructor(private _configuration: AuthConfiguration) {
    }

    public init() {
        this._sessionIframe = window.document.createElement('iframe');
        console.log(this._sessionIframe);
        this._sessionIframe.style.display = 'none';
        this._sessionIframe.src = this._configuration.checksession;

        window.document.body.appendChild(this._sessionIframe);
        this._iframeMessageEvent = this._messageHandler.bind(this);
        window.addEventListener('message', this._iframeMessageEvent, false);

        return new Promise((resolve) => {
            this._sessionIframe.onload = () => {
                resolve();
            }
        });
    }

    public pollServerSession(session_state: any, clientId: any) {
        let source = Observable.timer(3000, 3000)
            .timeInterval()
            .pluck('interval')
            .take(10000);

        let subscription = source.subscribe(() => {
            console.log(this._sessionIframe);
            this._sessionIframe.contentWindow.postMessage(clientId + ' ' + session_state, this._configuration.server);
        },
            function (err: any) {
                console.log('Error: ' + err);
            },
            function () {
                console.log('Completed');
            });
    }

    private _messageHandler(e: any) {
        if (e.origin === this._configuration.server &&
            e.source === this._sessionIframe.contentWindow
        ) {
            if (e.data === 'error') {
                console.log('error _messageHandler from check session op iframe');
            } else if (e.data === 'changed') {
                this.onCheckSessionChanged.emit();
            } else {
                console.log(e.data + ' _messageHandler from check session op iframe');
            }
        }
    }
}