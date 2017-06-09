import { Injectable } from '@angular/core';
import { OidcSecurityCommon } from './oidc.security.common';

@Injectable()
export class OidcSecuritySilentRenew {
    private sessionIframe: any;

    constructor(private oidcSecurityCommon: OidcSecurityCommon) {
    }

    initRenew() {
        this.sessionIframe = window.document.createElement('iframe');
        this.oidcSecurityCommon.logDebug(this.sessionIframe);
        this.sessionIframe.style.display = 'none';

        window.document.body.appendChild(this.sessionIframe);
    }

    startRenew(url: string) {
        this.oidcSecurityCommon.logDebug('startRenew for URL:' + url);
        this.sessionIframe.src = url;

        return new Promise((resolve) => {
            this.sessionIframe.onload = () => {
                resolve();
            }
        });
    }
}