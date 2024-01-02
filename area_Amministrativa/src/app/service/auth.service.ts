import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {JwtHelperService} from "@auth0/angular-jwt";
import { BehaviorSubject } from 'rxjs';
import {ToastrService} from "ngx-toastr";


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  constructor(private router: Router, private toastr: ToastrService) { }

    jwtHelper = new JwtHelperService();

    public isAuthenticated(): boolean {
      const token = localStorage.getItem('accessToken');

      // get role
      localStorage.setItem('ROLE', this.getRoleFromJwt());
      if (this.jwtHelper.isTokenExpired(token)) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("ROLE")
        this.loggedIn.next(false);
      }

      return !this.jwtHelper.isTokenExpired(token);
    }

    public getRoleFromJwt(): string {
      const token = localStorage.getItem('accessToken');
      // verifica se il token non è null
      if (token) {
        const decodedJwt = this.jwtHelper.decodeToken(token);
        return decodedJwt.role;
      }
      return '';
    }

  logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("ROLE")
    this.loggedIn.next(false);
    this.router.navigate([('')]);
    this.toastr.success("Logout successful", "Success")
  }

}
