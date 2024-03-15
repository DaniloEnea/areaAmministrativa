import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {JwtHelperService} from "@auth0/angular-jwt";
import {BehaviorSubject, catchError, mergeMap, Observable, of} from 'rxjs';
import {ToastrService} from "ngx-toastr";
import { HttpProviderService } from './http-provider.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  constructor(private http: HttpProviderService, private router: Router, private toastr: ToastrService) { }

  jwtHelper = new JwtHelperService();

  public isAuthenticated(): boolean {
    const token = localStorage.getItem('accessToken');

    localStorage.setItem('ROLE', this.getRoleFromJwt());
    const role = localStorage.getItem('ROLE');
    let checkRole: boolean = false;


    if (role == 'ROLE_SA' || 'ROLE_ADMIN') {
      checkRole = true;
    }

    if (this.jwtHelper.isTokenExpired(token)) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("ROLE")
      this.loggedIn.next(false);
    }

    return !this.jwtHelper.isTokenExpired(token) && checkRole;
  }

  public testIsAuthenticated(callback: (authenticated: boolean) => void): void {
  const token = localStorage.getItem('accessToken');
  const role = localStorage.getItem('ROLE') ?? '';

  this.http.getUserExists(this.getUsernameFromJwt()).pipe(
    mergeMap((value: any) => {
      const checkUser: boolean = value.body;
      const checkRole: boolean = role.includes('ROLE_ADMIN' || 'ROLE_SA') && checkUser;

      if (this.jwtHelper.isTokenExpired(token)) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("ROLE");
        this.loggedIn.next(false);
        return of(false);
      } else {
        return of(checkRole);
      }
    }),
    catchError((error: any) => {
      console.error(error);
      return of(false);
    })
  ).subscribe((authenticated: boolean) => {
    callback(authenticated);
  });
}


  public getRoleFromJwt(): string {
    const token = localStorage.getItem('accessToken');
    // verifica se il token non è null
    if (token) {
      const decodedJwt = this.jwtHelper.decodeToken(token);
      return decodedJwt.roles;
    }
    return '';
  }

  public getUsernameFromJwt(): string {
    const token = localStorage.getItem('accessToken');

    if (token) {
      const decodedJwt = this.jwtHelper.decodeToken(token);
      return decodedJwt.name
    }
    return '';
  }

  checkIsSA(): boolean {
    if (!this.getRoleFromJwt().includes('ROLE_SA')) {
      return false;
    }
    else {
      return true;
    }
  }

  logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("ROLE")
    this.loggedIn.next(false);
    this.router.navigate([('login')]);
    this.toastr.success("Logout successful", "Success")
  }

}
