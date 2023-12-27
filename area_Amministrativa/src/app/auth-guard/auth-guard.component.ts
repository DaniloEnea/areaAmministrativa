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
     if (!this.auth.isAuthenticated()) {
      this.router.navigate(['']);
      return false;
    }
    return true;
  }
}
  export const isAuthGuardComponent: CanActivateFn = (route: ActivatedRouteSnapshot,state: RouterStateSnapshot):boolean => {
  return inject(AuthGuardComponent).canActive(route, state);
}
