import { HttpResponse } from '@angular/common/http';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { isObservable, of, throwError } from 'rxjs';
import { createRetriableStream } from '../../test/create-retriable-stream.helper';
import { DataService } from '../api/data.service';
import { DataServiceMock } from '../api/data.service-mock';
import { LoggerService } from '../logging/logger.service';
import { LoggerServiceMock } from '../logging/logger.service-mock';
import { StoragePersistenceService } from '../storage/storage-persistence.service';
import { StoragePersistenceServiceMock } from '../storage/storage-persistence.service-mock';
import { SigninKeyDataService } from './signin-key-data.service';

const DUMMY_JWKS = {
  keys: [
    {
      kid: 'random-id',
      kty: 'RSA',
      alg: 'RS256',
      use: 'sig',
      n: 'some-value',
      e: 'AQAB',
      x5c: ['some-value'],
      x5t: 'some-value',
      'x5t#S256': 'some-value',
    },
  ],
};

describe('Signin Key Data Service', () => {
  let service: SigninKeyDataService;
  let storagePersistenceService: StoragePersistenceService;
  let dataService: DataService;
  let loggerService: LoggerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SigninKeyDataService,
        { provide: DataService, useClass: DataServiceMock },
        { provide: LoggerService, useClass: LoggerServiceMock },
        { provide: StoragePersistenceService, useClass: StoragePersistenceServiceMock },
      ],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(SigninKeyDataService);
    storagePersistenceService = TestBed.inject(StoragePersistenceService);
    dataService = TestBed.inject(DataService);
    loggerService = TestBed.inject(LoggerService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('getSigningKeys', () => {
    it(
      'throws error when no wellKnownEndpoints given',
      waitForAsync(() => {
        spyOn(storagePersistenceService, 'read').withArgs('authWellKnownEndPoints', 'configId').and.returnValue(null);
        const result = service.getSigningKeys('configId');

        result.subscribe({
          error: (err) => {
            expect(err).toBeTruthy();
          },
        });
      })
    );

    it(
      'throws error when no jwksUri given',
      waitForAsync(() => {
        spyOn(storagePersistenceService, 'read').withArgs('authWellKnownEndPoints', 'configId').and.returnValue({ jwksUri: null });
        const result = service.getSigningKeys('configId');

        result.subscribe({
          error: (err) => {
            expect(err).toBeTruthy();
          },
        });
      })
    );

    it(
      'calls dataservice if jwksurl is given',
      waitForAsync(() => {
        spyOn(storagePersistenceService, 'read').withArgs('authWellKnownEndPoints', 'configId').and.returnValue({ jwksUri: 'someUrl' });
        const spy = spyOn(dataService, 'get').and.callFake(() => of());

        const result = service.getSigningKeys('configId');

        result.subscribe({
          complete: () => {
            expect(spy).toHaveBeenCalledWith('someUrl', 'configId');
          },
        });
      })
    );

    it(
      'should retry once',
      waitForAsync(() => {
        spyOn(storagePersistenceService, 'read').withArgs('authWellKnownEndPoints', 'configId').and.returnValue({ jwksUri: 'someUrl' });
        spyOn(dataService, 'get').and.returnValue(createRetriableStream(throwError({}), of(DUMMY_JWKS)));

        service.getSigningKeys('configId').subscribe({
          next: (res) => {
            expect(res).toBeTruthy();
            expect(res).toEqual(DUMMY_JWKS);
          },
        });
      })
    );

    it(
      'should retry twice',
      waitForAsync(() => {
        spyOn(storagePersistenceService, 'read').withArgs('authWellKnownEndPoints', 'configId').and.returnValue({ jwksUri: 'someUrl' });
        spyOn(dataService, 'get').and.returnValue(createRetriableStream(throwError({}), throwError({}), of(DUMMY_JWKS)));

        service.getSigningKeys('configId').subscribe({
          next: (res) => {
            expect(res).toBeTruthy();
            expect(res).toEqual(DUMMY_JWKS);
          },
        });
      })
    );

    it(
      'should fail after three tries',
      waitForAsync(() => {
        spyOn(storagePersistenceService, 'read').withArgs('authWellKnownEndPoints', 'configId').and.returnValue({ jwksUri: 'someUrl' });
        spyOn(dataService, 'get').and.returnValue(createRetriableStream(throwError({}), throwError({}), throwError({}), of(DUMMY_JWKS)));

        service.getSigningKeys('configId').subscribe({
          error: (err) => {
            expect(err).toBeTruthy();
          },
        });
      })
    );
  });

  describe('handleErrorGetSigningKeys', () => {
    it(
      'keeps observable if error is catched',
      waitForAsync(() => {
        const result = (service as any).handleErrorGetSigningKeys(new HttpResponse());
        const hasTypeObservable = isObservable(result);
        expect(hasTypeObservable).toBeTrue();
      })
    );

    it(
      'logs error if error is response',
      waitForAsync(() => {
        const logSpy = spyOn(loggerService, 'logError');
        (service as any).handleErrorGetSigningKeys(new HttpResponse({ status: 400, statusText: 'nono' }), 'configId').subscribe({
          error: () => {
            expect(logSpy).toHaveBeenCalledWith('configId', '400 - nono {}');
          },
        });
      })
    );

    it(
      'logs error if error is not a response',
      waitForAsync(() => {
        const logSpy = spyOn(loggerService, 'logError');
        (service as any).handleErrorGetSigningKeys('Just some Error', 'configId').subscribe({
          error: () => {
            expect(logSpy).toHaveBeenCalledWith('configId', 'Just some Error');
          },
        });
      })
    );

    it(
      'logs error if error with message property is not a response',
      waitForAsync(() => {
        const logSpy = spyOn(loggerService, 'logError');
        (service as any).handleErrorGetSigningKeys({ message: 'Just some Error' }, 'configId').subscribe({
          error: () => {
            expect(logSpy).toHaveBeenCalledWith('configId', 'Just some Error');
          },
        });
      })
    );
  });
});
