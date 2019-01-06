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
var TokenHelperService = (function () {
    function TokenHelperService(loggerService) {
        this.loggerService = loggerService;
        this.PARTS_OF_TOKEN = 3;
    }
    TokenHelperService.prototype.getTokenExpirationDate = function (dataIdToken) {
        if (!dataIdToken.hasOwnProperty('exp')) {
            return new Date();
        }
        var date = new Date(0);
        date.setUTCSeconds(dataIdToken.exp);
        return date;
    };
    TokenHelperService.prototype.getHeaderFromToken = function (token, encoded) {
        if (!this.tokenIsValid(token)) {
            return {};
        }
        return this.getPartOfToken(token, 0, encoded);
    };
    TokenHelperService.prototype.getPayloadFromToken = function (token, encoded) {
        if (!this.tokenIsValid(token)) {
            return {};
        }
        return this.getPartOfToken(token, 1, encoded);
    };
    TokenHelperService.prototype.getSignatureFromToken = function (token, encoded) {
        if (!this.tokenIsValid(token)) {
            return {};
        }
        return this.getPartOfToken(token, 2, encoded);
    };
    TokenHelperService.prototype.getPartOfToken = function (token, index, encoded) {
        var partOfToken = this.extractPartOfToken(token, index);
        if (encoded) {
            return partOfToken;
        }
        var result = this.urlBase64Decode(partOfToken);
        return JSON.parse(result);
    };
    TokenHelperService.prototype.urlBase64Decode = function (str) {
        var output = str.replace(/-/g, '+').replace(/_/g, '/');
        switch (output.length % 4) {
            case 0:
                break;
            case 2:
                output += '==';
                break;
            case 3:
                output += '=';
                break;
            default:
                throw Error('Illegal base64url string!');
        }
        var decoded = typeof window !== 'undefined' ? window.atob(output) : new Buffer(output, 'base64').toString('binary');
        try {
            return decodeURIComponent(decoded.split('')
                .map(function (c) { return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2); })
                .join(''));
        }
        catch (err) {
            return decoded;
        }
    };
    TokenHelperService.prototype.tokenIsValid = function (token) {
        if (!token) {
            this.loggerService.logError("token '" + token + "' is not valid --> token falsy");
            return false;
        }
        if (!token.includes('.')) {
            this.loggerService.logError("token '" + token + "' is not valid --> no dots included");
            return false;
        }
        var parts = token.split('.');
        if (parts.length !== this.PARTS_OF_TOKEN) {
            this.loggerService.logError("token '" + token + "' is not valid --> token has t have exact three dots");
            return false;
        }
        return true;
    };
    TokenHelperService.prototype.extractPartOfToken = function (token, index) {
        return token.split('.')[index];
    };
    TokenHelperService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [LoggerService])
    ], TokenHelperService);
    return TokenHelperService;
}());
export { TokenHelperService };
//# sourceMappingURL=oidc-token-helper.service.js.map