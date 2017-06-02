import { Injectable } from '@angular/core';
import { AuthConfiguration } from '../auth.configuration';

@Injectable()
export class OidcSecuritySilentRenew {
    private _sessionIframe: any;

    constructor(private _configuration: AuthConfiguration) {
    }

    public initRenew() {
        this._sessionIframe = window.document.createElement('iframe');
        console.log(this._sessionIframe);
        this._sessionIframe.style.display = 'none';

        window.document.body.appendChild(this._sessionIframe);
    }

    public startRenew(url: string) {
        this._sessionIframe.src = url;

        return new Promise((resolve) => {
            this._sessionIframe.onload = () => {
                resolve();
            }
        });
    }
}