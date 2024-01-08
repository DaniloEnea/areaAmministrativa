import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { SidenavService } from '../service/SidenavService';
import {Router} from "@angular/router";
import { Observable } from 'rxjs';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit{

  isLoggedIn$!: Observable<boolean>;

  constructor(private sidenavService: SidenavService, private router: Router, private authService: AuthService) {

  }
    ngOnInit(): void {
      this.isLoggedIn$ = this.authService.isLoggedIn;
    }

  toggleSidenav() {
    this.sidenavService.toggle();
  }

  logout() {
    this.authService.logout();
  }

}
