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
import { OidcSecurityStorage } from './oidc.security.storage';
var OidcSecurityCommon = (function () {
    function OidcSecurityCommon(oidcSecurityStorage) {
        this.oidcSecurityStorage = oidcSecurityStorage;
        this.storage_auth_result = 'authorizationResult';
        this.storage_access_token = 'authorizationData';
        this.storage_id_token = 'authorizationDataIdToken';
        this.storage_is_authorized = '_isAuthorized';
        this.storage_user_data = 'userData';
        this.storage_auth_nonce = 'authNonce';
        this.storage_auth_state_control = 'authStateControl';
        this.storage_session_state = 'session_state';
        this.storage_silent_renew_running = 'storage_silent_renew_running';
        this.storage_custom_request_params = 'storage_custom_request_params';
    }
    Object.defineProperty(OidcSecurityCommon.prototype, "authResult", {
        get: function () {
            return this.retrieve(this.storage_auth_result);
        },
        set: function (value) {
            this.store(this.storage_auth_result, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OidcSecurityCommon.prototype, "accessToken", {
        get: function () {
            return this.retrieve(this.storage_access_token) || '';
        },
        set: function (value) {
            this.store(this.storage_access_token, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OidcSecurityCommon.prototype, "idToken", {
        get: function () {
            return this.retrieve(this.storage_id_token) || '';
        },
        set: function (value) {
            this.store(this.storage_id_token, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OidcSecurityCommon.prototype, "isAuthorized", {
        get: function () {
            return this.retrieve(this.storage_is_authorized);
        },
        set: function (value) {
            this.store(this.storage_is_authorized, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OidcSecurityCommon.prototype, "userData", {
        get: function () {
            return this.retrieve(this.storage_user_data);
        },
        set: function (value) {
            this.store(this.storage_user_data, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OidcSecurityCommon.prototype, "authNonce", {
        get: function () {
            return this.retrieve(this.storage_auth_nonce) || '';
        },
        set: function (value) {
            this.store(this.storage_auth_nonce, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OidcSecurityCommon.prototype, "authStateControl", {
        get: function () {
            return this.retrieve(this.storage_auth_state_control) || '';
        },
        set: function (value) {
            this.store(this.storage_auth_state_control, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OidcSecurityCommon.prototype, "sessionState", {
        get: function () {
            return this.retrieve(this.storage_session_state);
        },
        set: function (value) {
            this.store(this.storage_session_state, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OidcSecurityCommon.prototype, "silentRenewRunning", {
        get: function () {
            return this.retrieve(this.storage_silent_renew_running) || '';
        },
        set: function (value) {
            this.store(this.storage_silent_renew_running, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OidcSecurityCommon.prototype, "customRequestParams", {
        get: function () {
            return this.retrieve(this.storage_custom_request_params);
        },
        set: function (value) {
            this.store(this.storage_custom_request_params, value);
        },
        enumerable: true,
        configurable: true
    });
    OidcSecurityCommon.prototype.retrieve = function (key) {
        return this.oidcSecurityStorage.read(key);
    };
    OidcSecurityCommon.prototype.store = function (key, value) {
        this.oidcSecurityStorage.write(key, value);
    };
    OidcSecurityCommon.prototype.resetStorageData = function (isRenewProcess) {
        if (!isRenewProcess) {
            this.store(this.storage_auth_result, '');
            this.store(this.storage_session_state, '');
            this.store(this.storage_silent_renew_running, '');
            this.store(this.storage_is_authorized, false);
            this.store(this.storage_access_token, '');
            this.store(this.storage_id_token, '');
            this.store(this.storage_user_data, '');
        }
    };
    OidcSecurityCommon.prototype.getAccessToken = function () {
        return this.retrieve(this.storage_access_token);
    };
    OidcSecurityCommon.prototype.getIdToken = function () {
        return this.retrieve(this.storage_id_token);
    };
    OidcSecurityCommon = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [OidcSecurityStorage])
    ], OidcSecurityCommon);
    return OidcSecurityCommon;
}());
export { OidcSecurityCommon };
//# sourceMappingURL=oidc.security.common.js.map