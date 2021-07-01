import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, RouterStateSnapshot, UrlSegment } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { CheckAuthService } from '../check-auth.service';
import { ConfigurationProvider } from '../config/provider/config.provider';
import { LoginService } from '../login/login.service';
import { AutoLoginService } from './auto-login.service';

@Injectable({ providedIn: 'root' })
export class AutoLoginAllRoutesGuard implements CanActivate, CanLoad {
  constructor(
    private autoLoginService: AutoLoginService,
    private checkAuthService: CheckAuthService,
    private loginService: LoginService,
    private configurationProvider: ConfigurationProvider
  ) {}

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> {
    const routeToRedirect = segments.join('/');

    return this.checkAuth(routeToRedirect);
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.checkAuth(state.url);
  }

  private checkAuth(url: string): Observable<boolean> {
    const configId = this.getId();

    return this.checkAuthService.checkAuth().pipe(
      take(1),
      map(({ isAuthenticated }) => {
        if (isAuthenticated) {
          this.autoLoginService.checkSavedRedirectRouteAndNavigate(configId);
        }

        if (!isAuthenticated) {
          this.autoLoginService.saveRedirectRoute(configId, url);
          this.loginService.login(configId);
        }

        return isAuthenticated;
      })
    );
  }

  private getId(): string {
    return this.configurationProvider.getOpenIDConfiguration().configId;
  }
}
