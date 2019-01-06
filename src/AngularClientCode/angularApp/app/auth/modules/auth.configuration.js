var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Subject } from 'rxjs';
var OpenIDImplicitFlowConfiguration = (function () {
    function OpenIDImplicitFlowConfiguration() {
        this.stsServer = 'https://localhost:44318';
        this.redirect_url = 'https://localhost:44311';
        this.client_id = 'angularclient';
        this.response_type = 'id_token token';
        this.scope = 'openid email profile';
        this.hd_param = '';
        this.post_logout_redirect_uri = 'https://localhost:44311/unauthorized';
        this.start_checksession = false;
        this.silent_renew = false;
        this.silent_renew_url = 'https://localhost:44311';
        this.silent_renew_offset_in_seconds = 0;
        this.silent_redirect_url = 'https://localhost:44311';
        this.post_login_route = '/';
        this.forbidden_route = '/forbidden';
        this.unauthorized_route = '/unauthorized';
        this.auto_userinfo = true;
        this.auto_clean_state_after_authentication = true;
        this.trigger_authorization_result_event = false;
        this.log_console_warning_active = true;
        this.log_console_debug_active = false;
        this.iss_validation_off = false;
        this.max_id_token_iat_offset_allowed_in_seconds = 3;
        this.storage = typeof Storage !== 'undefined' ? sessionStorage : null;
    }
    return OpenIDImplicitFlowConfiguration;
}());
export { OpenIDImplicitFlowConfiguration };
var AuthConfiguration = (function () {
    function AuthConfiguration(platformId) {
        this.platformId = platformId;
        this._onConfigurationChange = new Subject();
        this.defaultConfig = new OpenIDImplicitFlowConfiguration();
    }
    Object.defineProperty(AuthConfiguration.prototype, "stsServer", {
        get: function () {
            if (this.openIDImplicitFlowConfiguration) {
                return this.openIDImplicitFlowConfiguration.stsServer;
            }
            return this.defaultConfig.stsServer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthConfiguration.prototype, "redirect_url", {
        get: function () {
            if (this.openIDImplicitFlowConfiguration) {
                return this.openIDImplicitFlowConfiguration.redirect_url;
            }
            return this.defaultConfig.redirect_url;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthConfiguration.prototype, "silent_redirect_url", {
        get: function () {
            if (this.openIDImplicitFlowConfiguration) {
                return this.openIDImplicitFlowConfiguration.silent_renew_url;
            }
            return this.defaultConfig.silent_renew_url;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthConfiguration.prototype, "client_id", {
        get: function () {
            if (this.openIDImplicitFlowConfiguration) {
                return this.openIDImplicitFlowConfiguration.client_id;
            }
            return this.defaultConfig.client_id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthConfiguration.prototype, "response_type", {
        get: function () {
            if (this.openIDImplicitFlowConfiguration) {
                return this.openIDImplicitFlowConfiguration.response_type;
            }
            return this.defaultConfig.response_type;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthConfiguration.prototype, "scope", {
        get: function () {
            if (this.openIDImplicitFlowConfiguration) {
                return this.openIDImplicitFlowConfiguration.scope;
            }
            return this.defaultConfig.scope;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthConfiguration.prototype, "hd_param", {
        get: function () {
            if (this.openIDImplicitFlowConfiguration) {
                return this.openIDImplicitFlowConfiguration.hd_param;
            }
            return this.defaultConfig.hd_param;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthConfiguration.prototype, "post_logout_redirect_uri", {
        get: function () {
            if (this.openIDImplicitFlowConfiguration) {
                return this.openIDImplicitFlowConfiguration.post_logout_redirect_uri;
            }
            return this.defaultConfig.post_logout_redirect_uri;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthConfiguration.prototype, "start_checksession", {
        get: function () {
            if (!isPlatformBrowser(this.platformId)) {
                return false;
            }
            if (this.openIDImplicitFlowConfiguration) {
                return this.openIDImplicitFlowConfiguration.start_checksession;
            }
            return this.defaultConfig.start_checksession;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthConfiguration.prototype, "silent_renew", {
        get: function () {
            if (!isPlatformBrowser(this.platformId)) {
                return false;
            }
            if (this.openIDImplicitFlowConfiguration) {
                return this.openIDImplicitFlowConfiguration.silent_renew;
            }
            return this.defaultConfig.silent_renew;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthConfiguration.prototype, "silent_renew_offset_in_seconds", {
        get: function () {
            if (this.openIDImplicitFlowConfiguration) {
                return this.openIDImplicitFlowConfiguration.silent_renew_offset_in_seconds;
            }
            return this.defaultConfig.silent_renew_offset_in_seconds;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthConfiguration.prototype, "post_login_route", {
        get: function () {
            if (this.openIDImplicitFlowConfiguration) {
                return this.openIDImplicitFlowConfiguration.post_login_route;
            }
            return this.defaultConfig.post_login_route;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthConfiguration.prototype, "forbidden_route", {
        get: function () {
            if (this.openIDImplicitFlowConfiguration) {
                return this.openIDImplicitFlowConfiguration.forbidden_route;
            }
            return this.defaultConfig.forbidden_route;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthConfiguration.prototype, "unauthorized_route", {
        get: function () {
            if (this.openIDImplicitFlowConfiguration) {
                return this.openIDImplicitFlowConfiguration.unauthorized_route;
            }
            return this.defaultConfig.unauthorized_route;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthConfiguration.prototype, "auto_userinfo", {
        get: function () {
            if (this.openIDImplicitFlowConfiguration) {
                return this.openIDImplicitFlowConfiguration.auto_userinfo;
            }
            return this.defaultConfig.auto_userinfo;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthConfiguration.prototype, "auto_clean_state_after_authentication", {
        get: function () {
            if (this.openIDImplicitFlowConfiguration) {
                return this.openIDImplicitFlowConfiguration.auto_clean_state_after_authentication;
            }
            return this.defaultConfig.auto_clean_state_after_authentication;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthConfiguration.prototype, "trigger_authorization_result_event", {
        get: function () {
            if (this.openIDImplicitFlowConfiguration) {
                return this.openIDImplicitFlowConfiguration.trigger_authorization_result_event;
            }
            return this.defaultConfig.trigger_authorization_result_event;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthConfiguration.prototype, "isLogLevelWarningEnabled", {
        get: function () {
            if (this.openIDImplicitFlowConfiguration) {
                return this.openIDImplicitFlowConfiguration.log_console_warning_active;
            }
            return this.defaultConfig.log_console_warning_active;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthConfiguration.prototype, "isLogLevelDebugEnabled", {
        get: function () {
            if (this.openIDImplicitFlowConfiguration) {
                return this.openIDImplicitFlowConfiguration.log_console_debug_active;
            }
            return this.defaultConfig.log_console_debug_active;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthConfiguration.prototype, "iss_validation_off", {
        get: function () {
            if (this.openIDImplicitFlowConfiguration) {
                return this.openIDImplicitFlowConfiguration.iss_validation_off;
            }
            return this.defaultConfig.iss_validation_off;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthConfiguration.prototype, "max_id_token_iat_offset_allowed_in_seconds", {
        get: function () {
            if (this.openIDImplicitFlowConfiguration) {
                return this.openIDImplicitFlowConfiguration.max_id_token_iat_offset_allowed_in_seconds;
            }
            return this.defaultConfig.max_id_token_iat_offset_allowed_in_seconds;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthConfiguration.prototype, "storage", {
        get: function () {
            if (this.openIDImplicitFlowConfiguration) {
                return this.openIDImplicitFlowConfiguration.storage;
            }
            return this.defaultConfig.storage;
        },
        enumerable: true,
        configurable: true
    });
    AuthConfiguration.prototype.init = function (openIDImplicitFlowConfiguration) {
        this.openIDImplicitFlowConfiguration = openIDImplicitFlowConfiguration;
        this._onConfigurationChange.next(openIDImplicitFlowConfiguration);
    };
    Object.defineProperty(AuthConfiguration.prototype, "onConfigurationChange", {
        get: function () {
            return this._onConfigurationChange.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    AuthConfiguration = __decorate([
        Injectable(),
        __param(0, Inject(PLATFORM_ID)),
        __metadata("design:paramtypes", [Object])
    ], AuthConfiguration);
    return AuthConfiguration;
}());
export { AuthConfiguration };
//# sourceMappingURL=auth.configuration.js.map