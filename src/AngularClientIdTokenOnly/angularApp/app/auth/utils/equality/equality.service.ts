import { Injectable } from '@angular/core';

@Injectable()
export class EqualityService {
  isStringEqualOrNonOrderedArrayEqual(value1: string | any[], value2: string | any[]): boolean {
    if (this.isNullOrUndefined(value1)) {
      return false;
    }

    if (this.isNullOrUndefined(value2)) {
      return false;
    }

    if (this.oneValueIsStringAndTheOtherIsArray(value1, value2)) {
      return false;
    }

    if (this.bothValuesAreStrings(value1, value2)) {
      return value1 === value2;
    }

    if (this.bothValuesAreArrays(value1, value2)) {
      return this.arraysHaveEqualContent(value1 as any[], value2 as any[]);
    }

    return false;
  }

  areEqual(value1: string | any[] | any | null | undefined, value2: string | any[] | any | null | undefined): boolean {
    if (!value1 || !value2) {
      return false;
    }

    if (this.bothValuesAreArrays(value1, value2)) {
      return this.arraysStrictEqual(value1 as any[], value2 as any[]);
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

    return false;
  }

  private oneValueIsStringAndTheOtherIsArray(value1: string | any | any[], value2: string | any | any[]): boolean {
    return (Array.isArray(value1) && this.valueIsString(value2)) || (Array.isArray(value2) && this.valueIsString(value1));
  }

  private bothValuesAreObjects(value1: string | any | any[], value2: string | any | any[]): boolean {
    return this.valueIsObject(value1) && this.valueIsObject(value2);
  }

  private bothValuesAreStrings(value1: string | any | any[], value2: string | any | any[]): boolean {
    return this.valueIsString(value1) && this.valueIsString(value2);
  }

  private bothValuesAreArrays(value1: string | any | any[], value2: string | any | any[]): boolean {
    return Array.isArray(value1) && Array.isArray(value2);
  }

  private valueIsString(value: any): boolean {
    return typeof value === 'string' || value instanceof String;
  }

  private valueIsObject(value: any): boolean {
    return typeof value === 'object';
  }

  private arraysStrictEqual(arr1: Array<string>, arr2: Array<string>): boolean {
    if (arr1.length !== arr2.length) {
      return false;
    }

    for (let i = arr1.length; i--; ) {
      if (arr1[i] !== arr2[i]) {
        return false;
      }
    }

    return true;
  }

  private arraysHaveEqualContent(arr1: Array<string>, arr2: Array<string>): boolean {
    if (arr1.length !== arr2.length) {
      return false;
    }

    return arr1.some((v) => arr2.includes(v));
  }

  private isNullOrUndefined(val: any): boolean {
    return val === null || val === undefined;
  }
}
