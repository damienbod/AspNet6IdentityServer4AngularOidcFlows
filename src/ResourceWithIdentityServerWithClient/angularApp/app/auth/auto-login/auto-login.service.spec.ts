import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { StoragePersistenceService } from '../storage/storage-persistence.service';
import { StoragePersistenceServiceMock } from '../storage/storage-persistence.service-mock';
import { AutoLoginService } from './auto-login.service';

describe('AutoLoginService ', () => {
  let autoLoginService: AutoLoginService;
  let storagePersistenceService: StoragePersistenceService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [AutoLoginService, { provide: StoragePersistenceService, useClass: StoragePersistenceServiceMock }],
    });
  });

  beforeEach(() => {
    router = TestBed.inject(Router);
    autoLoginService = TestBed.inject(AutoLoginService);
    storagePersistenceService = TestBed.inject(StoragePersistenceService);
  });

  it('should create', () => {
    expect(autoLoginService).toBeTruthy();
  });

  describe('checkSavedRedirectRouteAndNavigate', () => {
    it('if not route is saved, router and delete are not called', () => {
      const deleteSpy = spyOn(storagePersistenceService, 'remove');
      const routerSpy = spyOn(router, 'navigateByUrl');
      const readSpy = spyOn(storagePersistenceService, 'read').and.returnValue(null);

      autoLoginService.checkSavedRedirectRouteAndNavigate('configId');

      expect(deleteSpy).not.toHaveBeenCalled();
      expect(routerSpy).not.toHaveBeenCalled();
      expect(readSpy).toHaveBeenCalledOnceWith('redirect', 'configId');
    });

    it('if route is saved, router and delete are called', () => {
      const deleteSpy = spyOn(storagePersistenceService, 'remove');
      const routerSpy = spyOn(router, 'navigateByUrl');
      const readSpy = spyOn(storagePersistenceService, 'read').and.returnValue('saved-route');

      autoLoginService.checkSavedRedirectRouteAndNavigate('configId');

      expect(deleteSpy).toHaveBeenCalledOnceWith('redirect', 'configId');
      expect(routerSpy).toHaveBeenCalledOnceWith('saved-route');
      expect(readSpy).toHaveBeenCalledOnceWith('redirect', 'configId');
    });
  });

  describe('saveRedirectRoute', () => {
    it('calls storageService with correct params', () => {
      const writeSpy = spyOn(storagePersistenceService, 'write');

      autoLoginService.saveRedirectRoute('configId', 'some-route');

      expect(writeSpy).toHaveBeenCalledOnceWith('redirect', 'some-route', 'configId');
    });
  });
});
