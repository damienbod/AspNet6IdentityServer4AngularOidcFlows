var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, NgZone } from '@angular/core';
import { from, Observable, Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import { AuthConfiguration } from '../modules/auth.configuration';
import { IFrameService } from './existing-iframe.service';
import { LoggerService } from './oidc.logger.service';
import { OidcSecurityCommon } from './oidc.security.common';
var IFRAME_FOR_CHECK_SESSION_IDENTIFIER = 'myiFrameForCheckSession';
var OidcSecurityCheckSession = (function () {
    function OidcSecurityCheckSession(authConfiguration, oidcSecurityCommon, loggerService, iFrameService, zone) {
        this.authConfiguration = authConfiguration;
        this.oidcSecurityCommon = oidcSecurityCommon;
        this.loggerService = loggerService;
        this.iFrameService = iFrameService;
        this.zone = zone;
        this.lastIFrameRefresh = 0;
        this.outstandingMessages = 0;
        this.heartBeatInterval = 3000;
        this.iframeRefreshInterval = 60000;
        this._onCheckSessionChanged = new Subject();
    }
    Object.defineProperty(OidcSecurityCheckSession.prototype, "onCheckSessionChanged", {
        get: function () {
            return this._onCheckSessionChanged.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    OidcSecurityCheckSession.prototype.setupModule = function (authWellKnownEndpoints) {
        this.authWellKnownEndpoints = Object.assign({}, authWellKnownEndpoints);
    };
    OidcSecurityCheckSession.prototype.doesSessionExist = function () {
        var existingIFrame = this.iFrameService.getExistingIFrame(IFRAME_FOR_CHECK_SESSION_IDENTIFIER);
        if (!existingIFrame) {
            return false;
        }
        this.sessionIframe = existingIFrame;
        return true;
    };
    OidcSecurityCheckSession.prototype.init = function () {
        var _this = this;
        if (this.lastIFrameRefresh + this.iframeRefreshInterval > Date.now()) {
            return from([this]);
        }
        if (!this.doesSessionExist()) {
            this.sessionIframe = this.iFrameService.addIFrameToWindowBody(IFRAME_FOR_CHECK_SESSION_IDENTIFIER);
            this.iframeMessageEvent = this.messageHandler.bind(this);
            window.addEventListener('message', this.iframeMessageEvent, false);
        }
        if (this.authWellKnownEndpoints) {
            this.sessionIframe.contentWindow.location.replace(this.authWellKnownEndpoints.check_session_iframe);
        }
        else {
            this.loggerService.logWarning('init check session: authWellKnownEndpoints is undefined');
        }
        return Observable.create(function (observer) {
            _this.sessionIframe.onload = function () {
                _this.lastIFrameRefresh = Date.now();
                observer.next(_this);
                observer.complete();
            };
        });
    };
    OidcSecurityCheckSession.prototype.startCheckingSession = function (clientId) {
        if (this.scheduledHeartBeat) {
            return;
        }
        this.pollServerSession(clientId);
    };
    OidcSecurityCheckSession.prototype.stopCheckingSession = function () {
        if (!this.scheduledHeartBeat) {
            return;
        }
        this.clearScheduledHeartBeat();
    };
    OidcSecurityCheckSession.prototype.pollServerSession = function (clientId) {
        var _this = this;
        var _pollServerSessionRecur = function () {
            _this.init()
                .pipe(take(1))
                .subscribe(function () {
                if (_this.sessionIframe && clientId) {
                    _this.loggerService.logDebug(_this.sessionIframe);
                    var session_state = _this.oidcSecurityCommon.sessionState;
                    if (session_state) {
                        _this.outstandingMessages++;
                        _this.sessionIframe.contentWindow.postMessage(clientId + ' ' + session_state, _this.authConfiguration.stsServer);
                    }
                    else {
                        _this.loggerService.logDebug('OidcSecurityCheckSession pollServerSession session_state is blank');
                        _this._onCheckSessionChanged.next();
                    }
                }
                else {
                    _this.loggerService.logWarning('OidcSecurityCheckSession pollServerSession sessionIframe does not exist');
                    _this.loggerService.logDebug(clientId);
                    _this.loggerService.logDebug(_this.sessionIframe);
                }
                if (_this.outstandingMessages > 3) {
                    _this.loggerService.logError("OidcSecurityCheckSession not receiving check session response messages. Outstanding messages: " + _this.outstandingMessages + ". Server unreachable?");
                    _this._onCheckSessionChanged.next();
                }
                _this.scheduledHeartBeat = setTimeout(_pollServerSessionRecur, _this.heartBeatInterval);
            });
        };
        this.outstandingMessages = 0;
        this.zone.runOutsideAngular(function () {
            _this.scheduledHeartBeat = setTimeout(_pollServerSessionRecur, _this.heartBeatInterval);
        });
    };
    OidcSecurityCheckSession.prototype.clearScheduledHeartBeat = function () {
        clearTimeout(this.scheduledHeartBeat);
        this.scheduledHeartBeat = null;
    };
    OidcSecurityCheckSession.prototype.messageHandler = function (e) {
        this.outstandingMessages = 0;
        if (this.sessionIframe && e.origin === this.authConfiguration.stsServer && e.source === this.sessionIframe.contentWindow) {
            if (e.data === 'error') {
                this.loggerService.logWarning('error from checksession messageHandler');
            }
            else if (e.data === 'changed') {
                this._onCheckSessionChanged.next();
            }
            else {
                this.loggerService.logDebug(e.data + ' from checksession messageHandler');
            }
        }
    };
    OidcSecurityCheckSession = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [AuthConfiguration,
            OidcSecurityCommon,
            LoggerService,
            IFrameService,
            NgZone])
    ], OidcSecurityCheckSession);
    return OidcSecurityCheckSession;
}());
export { OidcSecurityCheckSession };
//# sourceMappingURL=oidc.security.check-session.js.map