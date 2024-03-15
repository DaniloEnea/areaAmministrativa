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
       const userRoles = this.auth.getRoleFromJwt();
       console.log(userRoles);

       // Verifica se l'utente ha almeno uno dei ruoli richiesti specificati nella route
       if (route.data['role'] && !route.data['role'].some((role: string) => userRoles.includes(role))) {
         // L'utente non ha i ruoli necessari, quindi reindirizzalo alla pagina di login
         this.router.navigate(['login']);
         return false;
       }

       // L'utente ha almeno uno dei ruoli richiesti, puoi fare altre azioni necessarie qui
       this.auth.loggedIn.next(true);
       return true;
     }

     // L'utente non è autenticato, quindi reindirizzalo alla pagina di login
     this.router.navigate(['login']);
     return false;
   }



}
  export const isAuthGuardComponent: CanActivateFn = (route: ActivatedRouteSnapshot,state: RouterStateSnapshot):boolean => {
  return inject(AuthGuardComponent).canActive(route, state);
}
