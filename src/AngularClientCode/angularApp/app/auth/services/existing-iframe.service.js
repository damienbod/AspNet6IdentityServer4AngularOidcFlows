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
import { LoggerService } from './oidc.logger.service';
var IFrameService = (function () {
    function IFrameService(loggerService) {
        this.loggerService = loggerService;
    }
    IFrameService.prototype.getExistingIFrame = function (identifier) {
        var iFrameOnParent = this.getIFrameFromParentWindow(identifier);
        if (iFrameOnParent) {
            return iFrameOnParent;
        }
        return this.getIFrameFromWindow(identifier);
    };
    IFrameService.prototype.addIFrameToWindowBody = function (identifier) {
        var sessionIframe = window.document.createElement('iframe');
        sessionIframe.id = identifier;
        this.loggerService.logDebug(sessionIframe);
        sessionIframe.style.display = 'none';
        window.document.body.appendChild(sessionIframe);
        return sessionIframe;
    };
    IFrameService.prototype.getIFrameFromParentWindow = function (identifier) {
        return window.parent.document.getElementById(identifier);
    };
    IFrameService.prototype.getIFrameFromWindow = function (identifier) {
        return window.document.getElementById(identifier);
    };
    IFrameService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [LoggerService])
    ], IFrameService);
    return IFrameService;
}());
export { IFrameService };
//# sourceMappingURL=existing-iframe.service.js.map