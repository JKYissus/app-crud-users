import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree, createUrlTreeFromSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardGuard implements CanActivate, CanActivateChild {

  constructor(
    private router: Router
  ) {

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean | UrlTree {

    return this.isAuthUser();
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean | UrlTree {

    return this.isAuthUser();
  }


  isAuthUser(): boolean | UrlTree {
    const session = sessionStorage.getItem('session');
    const timeExpired = sessionStorage.getItem('timeExpired');

    if (!session) {
      return this.router.parseUrl('/login');
    }

    const currentDate = new Date();

    const expiredDate = new Date(timeExpired!);

    if (currentDate > expiredDate) {
      return this.router.parseUrl('/login');
    }

    return true;
  }

}
