import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {JwtHelperService} from "@auth0/angular-jwt";
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  constructor(private router: Router) { }

    jwtHelper = new JwtHelperService();

    public isAuthenticated(): boolean {
      const token = localStorage.getItem('accessToken');
      // Check whether the token is expired and return
      // true or false
      this.loggedIn.next(true);
      return !this.jwtHelper.isTokenExpired(token);
    }

  logout() {
    localStorage.removeItem("accessToken");
    this.loggedIn.next(false);
    this.router.navigate([('')]);
    console.log("logout successful");
  }
    
}
