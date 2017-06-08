import { Injectable } from '@angular/core';

@Injectable()
export class OidcSecuritySilentRenew {
    private sessionIframe: any;

    initRenew() {
        this.sessionIframe = window.document.createElement('iframe');
        console.log(this.sessionIframe);
        this.sessionIframe.style.display = 'none';

        window.document.body.appendChild(this.sessionIframe);
    }

    startRenew(url: string) {
        this.sessionIframe.src = url;

        return new Promise((resolve) => {
            this.sessionIframe.onload = () => {
                resolve();
            }
        });
    }
}