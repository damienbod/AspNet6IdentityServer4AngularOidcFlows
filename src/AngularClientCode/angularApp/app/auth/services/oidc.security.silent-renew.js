var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IFrameService } from './existing-iframe.service';
import { LoggerService } from './oidc.logger.service';
var IFRAME_FOR_SILENT_RENEW_IDENTIFIER = 'myiFrameForSilentRenew';
var OidcSecuritySilentRenew = (function () {
    function OidcSecuritySilentRenew(loggerService, iFrameService) {
        this.loggerService = loggerService;
        this.iFrameService = iFrameService;
        this.isRenewInitialized = false;
    }
    OidcSecuritySilentRenew.prototype.initRenew = function () {
        var existingIFrame = this.iFrameService.getExistingIFrame(IFRAME_FOR_SILENT_RENEW_IDENTIFIER);
        if (!existingIFrame) {
            this.iFrameService.addIFrameToWindowBody(IFRAME_FOR_SILENT_RENEW_IDENTIFIER);
        }
        this.isRenewInitialized = true;
    };
    OidcSecuritySilentRenew.prototype.startRenew = function (url) {
        var _this = this;
        if (!this.isRenewInitialized) {
            this.initRenew();
        }
        this.sessionIframe = this.iFrameService.getExistingIFrame(IFRAME_FOR_SILENT_RENEW_IDENTIFIER);
        this.loggerService.logDebug('startRenew for URL:' + url);
        this.sessionIframe.contentWindow.location.replace(url);
        return Observable.create(function (observer) {
            _this.sessionIframe.onload = function () {
                observer.next(_this);
                observer.complete();
            };
        });
    };
    OidcSecuritySilentRenew = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [LoggerService, IFrameService])
    ], OidcSecuritySilentRenew);
    return OidcSecuritySilentRenew;
}());
export { OidcSecuritySilentRenew };
//# sourceMappingURL=oidc.security.silent-renew.js.map