import {Component, inject, Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanActivateFn, Router, RouterStateSnapshot} from "@angular/router";
import {AuthService} from "../service/auth.service";

 @Injectable({
     providedIn: 'root'
 })
class AuthGuardComponent{
   constructor(public auth: AuthService, public router: Router) {
   }

  canActive(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
     return this.checkUserLogin(route, state);
  }

   checkUserLogin(route: ActivatedRouteSnapshot, url: any): boolean {
    if (this.auth.isAuthenticated()) {
      const userRole = this.auth.getRoleFromJwt();
      if (userRole == "ROLE_SA" || "ROLE_ADMIN")
      {
        this.auth.loggedIn.next(true);
      }
      if (route.data['role'] && route.data['role'].indexOf(userRole) === -1) {
        this.router.navigate(['login']);
        return false;
      }
      return true;
    }

    this.router.navigate(['login']);
    return false;
  }


}
  export const isAuthGuardComponent: CanActivateFn = (route: ActivatedRouteSnapshot,state: RouterStateSnapshot):boolean => {
  return inject(AuthGuardComponent).canActive(route, state);
}
