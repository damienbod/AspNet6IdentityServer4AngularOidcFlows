var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from '@angular/core';
var EqualityHelperService = (function () {
    function EqualityHelperService() {
    }
    EqualityHelperService.prototype.areEqual = function (value1, value2) {
        if (!value1 || !value2) {
            return false;
        }
        if (this.bothValuesAreArrays(value1, value2)) {
            return this.arraysEqual(value1, value2);
        }
        if (this.bothValuesAreStrings(value1, value2)) {
            return value1 === value2;
        }
        if (this.bothValuesAreObjects(value1, value2)) {
            return JSON.stringify(value1).toLowerCase() === JSON.stringify(value2).toLowerCase();
        }
        if (this.oneValueIsStringAndTheOtherIsArray(value1, value2)) {
            if (Array.isArray(value1) && this.valueIsString(value2)) {
                return value1[0] === value2;
            }
            if (Array.isArray(value2) && this.valueIsString(value1)) {
                return value2[0] === value1;
            }
        }
    };
    EqualityHelperService.prototype.oneValueIsStringAndTheOtherIsArray = function (value1, value2) {
        return (Array.isArray(value1) && this.valueIsString(value2)) || (Array.isArray(value2) && this.valueIsString(value1));
    };
    EqualityHelperService.prototype.bothValuesAreObjects = function (value1, value2) {
        return this.valueIsObject(value1) && this.valueIsObject(value2);
    };
    EqualityHelperService.prototype.bothValuesAreStrings = function (value1, value2) {
        return this.valueIsString(value1) && this.valueIsString(value2);
    };
    EqualityHelperService.prototype.bothValuesAreArrays = function (value1, value2) {
        return Array.isArray(value1) && Array.isArray(value2);
    };
    EqualityHelperService.prototype.valueIsString = function (value) {
        return typeof value === 'string' || value instanceof String;
    };
    EqualityHelperService.prototype.valueIsObject = function (value) {
        return typeof value === 'object';
    };
    EqualityHelperService.prototype.arraysEqual = function (arr1, arr2) {
        if (arr1.length !== arr2.length) {
            return false;
        }
        for (var i = arr1.length; i--;) {
            if (arr1[i] !== arr2[i]) {
                return false;
            }
        }
        return true;
    };
    EqualityHelperService = __decorate([
        Injectable()
    ], EqualityHelperService);
    return EqualityHelperService;
}());
export { EqualityHelperService };
//# sourceMappingURL=oidc-equality-helper.service.js.map