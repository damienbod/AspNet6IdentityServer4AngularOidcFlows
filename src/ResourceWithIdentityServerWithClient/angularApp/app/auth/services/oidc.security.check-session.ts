import { Injectable, EventEmitter, Output } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/interval';
import 'rxjs/add/observable/timer';
import { AuthConfiguration } from '../auth.configuration';
import { OidcSecurityCommon } from './oidc.security.common';

// http://openid.net/specs/openid-connect-session-1_0-ID4.html

@Injectable()
export class OidcSecurityCheckSession {

    private sessionIframe: any;
    private iframeMessageEvent: any;

    @Output() onCheckSessionChanged: EventEmitter<any> = new EventEmitter<any>(true);

    constructor(private authConfiguration: AuthConfiguration, private oidcSecurityCommon: OidcSecurityCommon) {
    }

    init() {
        this.sessionIframe = window.document.createElement('iframe');
        this.oidcSecurityCommon.logDebug(this.sessionIframe);
        this.sessionIframe.style.display = 'none';
        this.sessionIframe.src = this.authConfiguration.checksession_url;

        window.document.body.appendChild(this.sessionIframe);
        this.iframeMessageEvent = this.messageHandler.bind(this);
        window.addEventListener('message', this.iframeMessageEvent, false);

        return new Promise((resolve) => {
            this.sessionIframe.onload = () => {
                resolve();
            }
        });
    }

    pollServerSession(session_state: any, clientId: any) {
        let source = Observable.timer(3000, 3000)
            .timeInterval()
            .pluck('interval')
            .take(10000);

        let subscription = source.subscribe(() => {
            this.oidcSecurityCommon.logDebug(this.sessionIframe);
            this.sessionIframe.contentWindow.postMessage(clientId + ' ' + session_state, this.authConfiguration.server);
        },
        function (err: any) {
            this.oidcSecurityCommon.logWarning('Error: ' + err);
        },
        function () {
            this.oidcSecurityCommon.logDebug('Completed');
        });
    }

    private messageHandler(e: any) {
        if (e.origin === this.authConfiguration.server &&
            e.source === this.sessionIframe.contentWindow
        ) {
            if (e.data === 'error') {
                this.oidcSecurityCommon.logWarning('error _messageHandler');
            } else if (e.data === 'changed') {
                this.onCheckSessionChanged.emit();
            } else {
                this.oidcSecurityCommon.logDebug(e.data + ' _messageHandler');
            }
        }
    }
}